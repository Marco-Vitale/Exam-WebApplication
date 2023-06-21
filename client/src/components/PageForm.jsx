import dayjs from 'dayjs';

import {useState} from 'react';
import {Form, Button, Table} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PageForm = (props) => {
  /*
   * Creating a state for each parameter of the page.
   * There are two possible cases: 
   * - if we are creating a new page, the form is initialized with the default values.
   * - if we are editing a page, the form is pre-filled with the previous values.
   */

  const [inputBlocks, setInputBlocks] = useState([]);  
  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [publicationDate, setPublicationDate] = useState((props.page && props.page.publicationDate) ? props.page.publicationDate.format('YYYY-MM-DD') : '');

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the page is saved (eventually modified) we return to the list of all films, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  const currentDate = dayjs().format('YYYY-MM-DD');

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

  const handleAdd = (type) => {
    setInputBlocks(prevInputBlocks => [...prevInputBlocks, {type: type, value: ''}]);
  };

  const handleInputGroupChange = (index, value) => {
    setInputBlocks(prevInputBlocks => {
      const updatedInputBlocks = [...prevInputBlocks];
      updatedInputBlocks[index].value = value;
      return updatedInputBlocks;
    });
  };

  const handleMoveUpClick = (index) => {
    if (index > 0) {
      setInputBlocks(prevInputBlocks => {
        const updatedInputBlocks = [...prevInputBlocks];
        const currentInputGroup = updatedInputBlocks[index];
        updatedInputBlocks[index] = updatedInputBlocks[index - 1];
        updatedInputBlocks[index - 1] = currentInputGroup;
        return updatedInputBlocks;
      });
    }
  };

  const handleMoveDownClick = (index) => {
    if (index < inputBlocks.length - 1) {
      setInputBlocks(prevInputBlocks => {
        const updatedInputBlocks = [...prevInputBlocks];
        const currentInputGroup = updatedInputBlocks[index];
        updatedInputBlocks[index] = updatedInputBlocks[index + 1];
        updatedInputBlocks[index + 1] = currentInputGroup;
        return updatedInputBlocks;
      });
    }
  };

  const handleDeleteClick = (index) => {
    setInputBlocks(prevInputBlocks => {
      const updatedInputBlocks = [...prevInputBlocks];
      updatedInputBlocks.splice(index, 1);
      return updatedInputBlocks;
    });
  };


  return (
    <>
    <Form className="block-example mb-0 form-padding" onSubmit={handleSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Publication Date</Form.Label>
        <Form.Control type="date" min={currentDate} value={publicationDate} onChange={event => setPublicationDate(event.target.value) }/>
      </Form.Group>

      {inputBlocks.map((inputValue, index) => (
        <Form.Group className="mb-3" key={index}>
          {inputValue.type === 'Header' ? (
          <>
          <Form.Label>Header</Form.Label>
          <Form.Control
            type="text"
            value={inputValue.value}
            onChange={event => handleInputGroupChange(index, event.target.value)}
          />
          </>) : inputValue.type === "Paragraph" ? (
          <>
          <Form.Label>Paragraph</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={inputValue.value}
            onChange={event => handleInputGroupChange(index, event.target.value)}
          />
          </>
          ) : (
            <>
          <Form.Label>Image</Form.Label>
            <Form.Select aria-label="Default select example" onChange={event => handleInputGroupChange(index, event.target.value)}>
              <option value="lakerslogo.png">Lakers logo</option>
              <option value="bullslogo.pns">Bulls logo</option>
              <option value="heatlogo.pns">Heat logo</option>
              <option value="warriorslogo.pns">Warriors logo</option>
            </Form.Select>
          </>
          )}
          <Button className="mt-1" variant="secondary" onClick={() => handleMoveUpClick(index)}>
            <i className="bi bi-arrow-up"></i>
          </Button>
          &nbsp;
          <Button className="mt-1" variant="secondary" onClick={() => handleMoveDownClick(index)}>
            <i className="bi bi-arrow-down"></i>
          </Button>
          &nbsp;
          <Button className="mt-1" variant="danger" onClick={() => handleDeleteClick(index)}>
            <i className="bi bi-trash"/>
          </Button>
        </Form.Group>
      ))}

      <Button className="mt-3 mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Link className="btn btn-danger mt-3 mb-3" to={nextpage}> Cancel </Link>
      &nbsp;

      <Button className="mt-3 mb-3" variant="secondary" onClick={() => handleAdd("Header")}>
        Add Header
      </Button>
      &nbsp;
      <Button className="mt-3 mb-3" variant="secondary" onClick={() => handleAdd("Paragraph")}>
        Add Paragraph
      </Button>

      &nbsp;
      <Button className="mt-3 mb-3" variant="secondary" onClick={() => handleAdd("Image")}>
        Add Image
      </Button>
    </Form>

    <p>Available images:</p>
    <Table>
      <thead>
        <tr>
          <th>Lakers logo</th>
          <th>Bulls logo</th>
          <th>Heat logo</th>
          <th>Warriors logo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
          <img src='/images/lakerslogo.png'/>
          </td>
          <td>
          <img src='/images/bullslogo.png'/>
          </td>
          <td>
          <img src='/images/heatlogo.png'/>
          </td>
          <td>
          <img src='/images/warriorslogo.png'/>
          </td>
        </tr>
      </tbody>
    </Table>
    </>
  )

}

export default PageForm;