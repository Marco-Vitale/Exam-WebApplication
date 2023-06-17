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
    <Navbar bg="success" variant="dark" fixed="top" className="navbar-padding justify-content-between" expand="lg">
        <Link to="/">
            <Navbar.Brand>
                CMSmall
            </Navbar.Brand>
        </Link>
        
        <Link to="backoffice">
            <Navbar.Brand>
                BackOffice
            </Navbar.Brand>
        </Link>

        <Nav className="ml-md-auto">
          <Navbar.Text className="mx-2">
            {(props.user && props.user.name && props.user.role) ? `Welcome, ${props.user.name}, Role: ${props.user.role}!` : "Welcome anonymous!"}
          </Navbar.Text>
            <Form className="mx-2">
                {props.loggedIn ? <LogoutButton logout={props.logout}/> : <LoginButton/>}
            </Form>
        </Nav>
    </Navbar>
  );
}

export { Navigation };

/*



*/