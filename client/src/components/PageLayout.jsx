import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import API from '../API';
import PagesTable from './PagesList';
import PageForm from './PageForm';
import SinglePage from './SinglePage';
import { LoginForm } from './Auth';

function DefaultLayout(props) {

  const location = useLocation();
  
  return (
    <Row className="vh-100 below-nav centered">
       <Outlet/>
    </Row>
  );
}

function MainLayout(props) {

  const dirty = props.dirty;
  const setDirty = props.setDirty;

  const location = useLocation();
  const flag = location.pathname === "/"

  const filter = flag ? "published" : "all"

  useEffect(() => {
    setDirty(true);
  }, [filter])

  useEffect(() => {
    const getPages = async () => {
      try{
      const p = await API.getPages(filter);
      props.setPages(p)
      setDirty(false);

      }catch(err){
        console.log(err)
        setDirty(false);
      }
    }

    if(dirty){
      getPages();
    }

  },[dirty,filter])

  const deletePage = (pageId) => {
    API.deletePage(pageId)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  return (
    <>
      <PagesTable pages={props.pages} user={props.user} loggedIn={props.loggedIn} deletePage={deletePage} />
      {!flag ?
      <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add" state={{nextpage: location.pathname}}> &#43; </Link> : <></>}
    </>
  )
}

function NotFoundLayout() {
    return(
        <>
          <h2 className='centered'>This is not the route you are looking for!</h2>
          <Link to="/">
            <Button variant="primary" className='centered'>Go Home!</Button>
          </Link>
        </>
    );
  }

/**
 * This layout shuld be rendered while we are waiting a response from the server.
 */
function LoadingLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={8} className="below-nav">
        <h1>The page is loading</h1>
      </Col>
    </Row>
  )
}

function LoginLayout(props) {
  return (
    <>
      <LoginForm login={props.login} />
    </>
  );
}

function AddLayout(props) {

  const setDirty = props.setDirty;
  //const {handleErrors} = useContext(MessageContext);

  // add a page into the list
  const addPage = (page) => {
    API.addPage(page)
      .then(() => { setDirty(true); })
      .catch(); 
  }
  return (
    <PageForm addPage={addPage} />
  );
}

function EditLayout(props) {

  const setDirty = props.setDirty;
  //const {handleErrors} = useContext(MessageContext);

  const { pageid } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    API.getPage(pageid)
      .then(page => {
        setPage(page);
      })
      .catch(); 

  }, [pageid]);

  const editPage = (page) => {
    API.updatePage(page, pageid)
      .then(() => { setDirty(true); })
      .catch(); 
  }

  return (
    page ? <PageForm page={page} editPage={editPage} pageid={pageid} user={props.user}/> : <></>
  );
    //    (page && blocks) ? <PageForm page={page} blocks={blocks} editPage={editPage} /> : <></>
}

function SinglePageLayout(){

  const { pageid } = useParams();
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    API.getPage(pageid)
      .then(page => {
        setPage(page);

        API.getBlocks(pageid)
        .then(blocks => {
        setBlocks(blocks)
    })
      })
      .catch(); 

  }, [pageid]);

  return (
    (page && blocks) ? <SinglePage pageData={page} blocks={blocks} /> : <></>
  )
}

export { DefaultLayout, NotFoundLayout, MainLayout, LoadingLayout, LoginLayout, AddLayout, SinglePageLayout, EditLayout}; 