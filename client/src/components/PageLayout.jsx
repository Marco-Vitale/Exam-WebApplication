import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import { LoginForm } from './Auth';

function DefaultLayout(props) {

  const location = useLocation();
  
  return (
    <Row className="vh-100">
      <Col md={8} xl={9} className="below-nav">
        <Outlet/>
      </Col>
    </Row>
  );
}

function MainLayout() {

  return (
    <>
      <h1 className='centered'>Welcome: Test1</h1> 
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
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}

export { DefaultLayout, NotFoundLayout, MainLayout, LoadingLayout, LoginLayout }; 