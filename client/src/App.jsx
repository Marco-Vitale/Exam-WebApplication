import { useState } from 'react'
import { Container} from 'react-bootstrap/'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { MainLayout, DefaultLayout, NotFoundLayout, LoginLayout, LoadingLayout } from './components/PageLayout';
import './App.css'

/*

npm install react-bootstrap
npm install bootstrap
npm install react-router-dom

Lato server:

Handling errors
npm install express-validator

Handling requests
npm install express
npm install morgan
npm install cors

Handling authentication
npm install passport
npm install passport-local
npm install express-session
*/

function App() {

  const loggedIn = true;
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      console.log("logged!");
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  return (
    <BrowserRouter>
        <Container fluid className="App">
          <Navigation loggedIn={loggedIn} />

          <Routes>
            <Route path="/" element={
            loading ? <LoadingLayout /> : <DefaultLayout />
            } >
              <Route index element={<MainLayout />} />
              <Route path="*" element={<NotFoundLayout />} />
            </Route>

            <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
          </Routes>

        </Container>
    </BrowserRouter>
  );

}

export default App
