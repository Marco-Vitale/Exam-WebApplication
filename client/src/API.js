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
 * Getting the  the list of pages.
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

 /**
 * Getting a page given its id
 */

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

 /**
 * Adds a new page in the db
 */

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

 /**
 * Delete a page given its id
 */

  function deletePage(pageId) {
    return getJson(
      fetch(SERVER_URL + "pages/" + pageId, {
        method: 'DELETE',
        credentials: 'include'
      })
    )
  }

   /**
 * Retrieve the list of blocks given a pageid
 */

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

/**
 * Update a page givrn its id
 */

  function updatePage(page,pageid) {

    return getJson(
      fetch(SERVER_URL + "pages/" + pageid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(page) 
      })
    )
  }

  /**
 * Retrive the list of users
 */

  const getUsers = async () => {
    return getJson(
        fetch(SERVER_URL + 'users/', { credentials: 'include' })
    )
    
  }

   /**
 * Retrive the title of the website
 */
  const getTitle = async () => {
    return getJson(
        fetch(SERVER_URL + 'title/', { credentials: 'include' })
    )
    
  }

    /**
 * Update the title of the website
 */
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