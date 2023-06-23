import React, { useEffect, useState, useContext } from 'react';

import API from '../API';
import { Navbar, Nav, Form, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';
import { Button } from 'react-bootstrap/'
import MessageContext from '../messageCtx';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const [showPop, setShowPop] = useState(false);
  const [title, setTitle] = useState("");

  const {handleErrors} = useContext(MessageContext);

  const handleClick = () => {
    setShowPop(true);
  };

  const handleClose = () => {
    setShowPop(false);
  };

  const handleUpdate = async ()  => {
    setShowPop(false)
    try{
    await API.updateTitle(title);
    }catch(err){
      handleErrors(err);
    }
  }

  useEffect(() => {
    const getTitle = async () => {
      const t = await API.getTitle()
      setTitle(t);
    }

    getTitle();
  },[])

  return (
    <Navbar bg="success" variant="dark" fixed="top" className="navbar-padding justify-content-between" expand="lg">
        <Nav className="ml-md-auto">
          <Navbar.Text className="mx-2">
          {`${title}`}
          </Navbar.Text>
          {
            (props.user && props.user.role === "Admin") ? (
              <Button className="btn btn-success" onClick={handleClick}>
                <i className="bi bi-pencil"></i>
              </Button>
            ) : (
              <></>
            )
          }
        </Nav>

        <Modal show={showPop} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change the name of the website!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Link to="/">
            <Navbar.Brand>
                FrontOffice
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