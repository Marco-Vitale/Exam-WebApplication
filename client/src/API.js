import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(credentials),
    })
    )
  };
  
  /**
   * This function is used to verify if the user is still logged-in.
   * It returns a JSON object with the user info.
   */
  const getUserInfo = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
      // this parameter specifies that authentication cookie must be forwared
      credentials: 'include'
    })
    )
  };
  
  /**
   * This function destroy the current user's session and execute the log-out.
   */
  const logOut = async() => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
      method: 'DELETE',
      credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
    })
    )
  }

  /**
 * Getting from the server side and returning the list of pages.
 */

const getPages = async (filter) => {

  return getJson(
      fetch(SERVER_URL + 'pages?filter=' + filter, { credentials: 'include' })
  ).then( json => {
    return json.map((page) => {

      const clientPage = {
        id: page.id,
        title: page.title,
        author: page.author,
        creationDate: dayjs(page.creationDate)
      }

      if (page.publicationDate)
        clientPage.publicationDate = dayjs(page.publicationDate);
      return clientPage;
    })
  })
}

const getPage = async (pageid) => {
  return getJson(
      fetch(SERVER_URL + 'pages/' + pageid, { credentials: 'include' })
  ).then( page => {

      const clientPage = {
        id: page.id,
        title: page.title,
        author: page.author,
        creationDate: dayjs(page.creationDate)
      }

      if (page.publicationDate)
        clientPage.publicationDate = dayjs(page.publicationDate);
      return clientPage;
    })
}

function addPage(page) {
  return getJson(
    fetch(SERVER_URL + "pages/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page) 
    })
  )
}

  function deletePage(pageId) {
    return getJson(
      fetch(SERVER_URL + "pages/" + pageId, {
        method: 'DELETE',
        credentials: 'include'
      })
    )
  }

  const getBlocks = async (pageid) => {

    return getJson(
        fetch(SERVER_URL + 'pages/blocks/' + pageid, { credentials: 'include' })
    ).then( json => {
      return json.map((block) => {
  
        const clientBlock = {
          id: block.id,
          pageid: block.pageid,
          type: block.type,
          content: block.content,
          position: block.position
        }

        return clientBlock;
      })
    })
  }

  function updatePage(page,pageid) {
    /*
    if (film && film.watchDate && (film.watchDate instanceof dayjs))
        film.watchDate = film.watchDate.format("YYYY-MM-DD");

    */

    return getJson(
      fetch(SERVER_URL + "pages/" + pageid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(page) // dayjs date is serialized correctly by the .toJSON method override
      })
    )
  }

  const getUsers = async () => {
    return getJson(
        fetch(SERVER_URL + 'users/', { credentials: 'include' })
    )
    
  }

  const getTitle = async () => {
    return getJson(
        fetch(SERVER_URL + 'title/', { credentials: 'include' })
    )
    
  }

  const updateTitle = async (title) => {
    return getJson(
      fetch(SERVER_URL + "title/", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: title })
      })
    )
  }
  
  const API = {logIn, getUserInfo, logOut, getPages, getPage, getBlocks, deletePage, addPage, updatePage, getUsers, getTitle, updateTitle};
  export default API;