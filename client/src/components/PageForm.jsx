import dayjs from 'dayjs';

import {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PageForm = (props) => {
  /*
   * Creating a state for each parameter of the page.
   * There are two possible cases: 
   * - if we are creating a new page, the form is initialized with the default values.
   * - if we are editing a page, the form is pre-filled with the previous values.
   */

  
  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [publicationDate, setPublicationDate] = useState((props.page && props.page.publicationDate) ? props.page.publicationDate.format('YYYY-MM-DD') : '');

  /*
  const [favorite, setFavorite] = useState(props.film ? props.film.favorite : false);
  // if exists film.watchDate is converted to string for the form control of type "date", otherwise it is set to empty string
  const [rating, setRating] = useState(props.film ? props.film.rating : 0);

  */

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the page is saved (eventually modified) we return to the list of all films, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  const handleSubmit = (event) => {
    event.preventDefault();
    /*
    // String.trim() method is used for removing leading and ending whitespaces from the title.
    const film = {"title": title.trim(), "favorite": favorite, "rating": rating, "watchDate": watchDate }
    
    /* In this solution validations are executed through HTML.
       If you prefer JavaScript validations, this is the right place for coding them. 

    if(props.film) {
      film.id = props.film.id;
      props.editFilm(film);
    }
    else
      props.addFilm(film);
    */

    navigate('/');
  }

  return (
    <Form className="block-example mb-0 form-padding" onSubmit={handleSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Publication Date</Form.Label>
        { /* watchDate is an optional parameter. It have to be properly rendered only if available. */ }
        <Form.Control type="date" value={publicationDate} onChange={event => setPublicationDate(event.target.value) }/>
      </Form.Group>

      <Form.Group classname="mb-3">
        <Form.Select aria-label="Default select example">
            <option>Open this select menu</option>
            <option value="Header">Header</option>
            <option value="Paragraph">Paragraph</option>
        </Form.Select>
      </Form.Group>

      <Button className="mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Link className="btn btn-danger mb-3" to={nextpage}> Cancel </Link>
    </Form>
  )

}

export default PageForm;