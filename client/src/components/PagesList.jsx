import 'dayjs';

import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function PagesTable(props) {
  
    return (
        <Table striped style={{ tableLayout: 'fixed' }}>
            <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            </colgroup>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Creation Date</th>
                    <th>Publication Date</th>
                </tr>
            </thead>
            <tbody>
            {
                props.pages.map((page) =>
                <PageRow key={page.id} pageData={page}/>)
            }
            </tbody>
        </Table>
    );
  }

  function PageRow(props) {

    const formatWatchDate = (dayJsDate, format) => {
      return dayJsDate ? dayJsDate.format(format) : '';
    }
  
    // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
    const location = useLocation();
  
    return(
      <tr>
        <td>
          <p>
            {props.pageData.title}
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
      </tr>
    );
  }

export default PagesTable;