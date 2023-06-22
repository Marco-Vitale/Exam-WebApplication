import dayjs from 'dayjs';

import {useEffect, useState} from 'react';
import {Form, Button, Table} from 'react-bootstrap';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import API from '../API';


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

  const { pageid } = useParams();

  // if the page is saved (eventually modified) we return to the FrontOffice, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  const currentDate = dayjs().format('YYYY-MM-DD');

  console.log(inputBlocks)

  const addflag = location.pathname === "/add"

  if(!addflag){

    useEffect(() => {
      const getBlocks = async () => {
        const blocks = await API.getBlocks(pageid);
        setInputBlocks(blocks);
      }

      getBlocks();

    },[])

  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let nHeaders = 0;
    let nOther = 0;

    const page = {"title": title.trim(), "creationDate": currentDate, "publicationDate": publicationDate, "blocks": inputBlocks}

    inputBlocks.forEach((x) => {
      if(x.type === "Header"){
        nHeaders++;
      }else{
        nOther++;
      }
    })

    if(nHeaders === 0 || (nHeaders !== 0 && nOther === 0)){
      console.log("at least 1 header and 1 other block")
    }else{
      if(props.page){
        console.log(page)
        props.editPage(page)
      }else{
        props.addPage(page)
      }
    }

    navigate('/backoffice');
  }

  const handleAdd = (type) => {
    setInputBlocks(prevInputBlocks => [...prevInputBlocks, {type: type, content: ''}]);
  };

  const handleInputGroupChange = (index, value) => {
    setInputBlocks(prevInputBlocks => {
      const updatedInputBlocks = [...prevInputBlocks];
      updatedInputBlocks[index].content = value;
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
            value={inputValue.content}
            onChange={event => handleInputGroupChange(index, event.target.value)}
          />
          </>) : inputValue.type === "Paragraph" ? (
          <>
          <Form.Label>Paragraph</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={inputValue.content}
            onChange={event => handleInputGroupChange(index, event.target.value)}
          />
          </>
          ) : (
            <>
          <Form.Label>Image</Form.Label>
            <Form.Select required={true} value={inputValue.content} aria-label="Default select example" onChange={event => handleInputGroupChange(index, event.target.value)}>
              <option value="" disabled selected>Select a logo</option>
              <option value="lakerslogo.png">Lakers logo</option>
              <option value="bullslogo.png">Bulls logo</option>
              <option value="heatlogo.png">Heat logo</option>
              <option value="warriorslogo.png">Warriors logo</option>
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