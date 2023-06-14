import React from 'react';

import { Navbar, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';
import { Container} from 'react-bootstrap/'
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Navbar bg="primary" variant="light" fixed="top" className="navbar-padding justify-content-between" expand="lg">
        <Link to="/">
            <Navbar.Brand>
                CMSmall
            </Navbar.Brand>
        </Link>
        
        <Nav className="ml-md-auto">
            <Form className="mx-2">
                {props.loggedIn ? <LogoutButton/> : <LoginButton/>}
            </Form>
        </Nav>
    </Navbar>
  );
}

export { Navigation };

/*



*/