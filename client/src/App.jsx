import { useState, useEffect } from 'react'
import { Container} from 'react-bootstrap/'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { MainLayout, DefaultLayout, NotFoundLayout, LoginLayout, LoadingLayout } from './components/PageLayout';
import API from './API';
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

  const [loading, setLoading] = useState(false);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);

  //TODO: MODIFICARE IL CATCH PER LA GESTIONE DI ERRORI

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await API.getUserInfo();  // here you have the user info, if already logged in
        setUser(user);
        setLoggedIn(true); setLoading(false);
      } catch (err) {
        console.log(err); // mostly unauthenticated user, thus set not logged in
        setUser(null);
        setLoggedIn(false); setLoading(false);
      }
    };
    init();
  }, []);  // This useEffect is called only the first time the component is mounted.

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */ 
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
    setFilms([]);
  };

  return (
    <BrowserRouter>
        <Container fluid className="App">
          <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} />

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
