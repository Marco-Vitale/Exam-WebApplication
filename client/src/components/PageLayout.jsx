import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import API from '../API';
import PagesTable from './PagesList';
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

  useEffect(() => {
    const getPages = async () => {
      try{
      const p = await API.getPages();
      props.setPages(p)
      }catch(err){
        console.log(err)
      }
    }

    getPages();

  },[])

  return (
    <>
      <PagesTable pages={props.pages} user={props.user} loggedIn={props.loggedIn} />
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

export { DefaultLayout, NotFoundLayout, MainLayout, LoadingLayout, LoginLayout }; 