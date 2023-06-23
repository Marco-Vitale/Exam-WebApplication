import 'dayjs';

import "bootstrap-icons/font/bootstrap-icons.css";
import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function PagesTable(props) {

    const location = useLocation();

    const flag = location.pathname === "/"

    return (
        <Table striped style={{ tableLayout: 'fixed', width: '100%', height: '85%' }}>
            
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Creation Date</th>
                    <th>Publication Date</th>
                    {!flag ? <th>Actions</th> : <></>}
                </tr>
            </thead>
            <tbody>
            {
                props.pages.map((page) =>
                <PageRow key={page.id} pageData={page} user={props.user} loggedIn={props.loggedIn} deletePage={props.deletePage} />)
            }
            </tbody>
        </Table>
    );
  }

  function PageRow(props) {

    const formatWatchDate = (dayJsDate, format) => {
      return dayJsDate ? dayJsDate.format(format) : '';
    }
  
    const location = useLocation();
    const flag = location.pathname === "/"

    return(
      <tr>
        <td>
          <p>
            <Link to={`/pages/${props.pageData.id}`}>{props.pageData.title}</Link>
          </p>
        </td>
        <td>
          <p>
            {props.pageData.author}
          </p>
        </td>
        <td>
          <small>{formatWatchDate(props.pageData.creationDate, 'MMMM D, YYYY')}</small>
        </td>
        <td>
          <small>{formatWatchDate(props.pageData.publicationDate, 'MMMM D, YYYY')}</small>
        </td>
          {!flag ? (
          <td>
          {(props.loggedIn && (props.user.role=="Admin" || (props.user.role=="User" && props.pageData.author == props.user.name))) ? (
            <Link className="btn btn-success" to={"/edit/" + props.pageData.id} state={{nextpage: location.pathname}}>
              <i className="bi bi-pencil-square"/>
            </Link>
            ) : (
            <span className="btn btn-success disabled" aria-disabled="true">
              <i className="bi bi-pencil-square"/>
            </span>
            )}
            &nbsp;
            <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)} disabled={!props.loggedIn || (props.user.role=="User" && props.user.name!=props.pageData.author)}>
              <i className="bi bi-trash"/>
            </Button>
          </td>) : <></>}
      </tr>
    );
  }

export default PagesTable;