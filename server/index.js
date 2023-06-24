'use strict';

const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const { check, validationResult, } = require('express-validator'); // validation middleware

const userDao = require('./dao-users'); // module for accessing the user table in the DB
const pagesDao = require('./dao-pages');

// init express and set-up the middlewares ***/
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUseR.
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name, role)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

//GET api/user
//Returns the list of the users

app.get('/api/users',
  isLoggedIn,
  (req, res) => {

    if(req.user.role!=="Admin"){
      return res.status(401).json({error: 'Not authorized'});
    }
    
    userDao.listUsers()
      .then(users => res.status(200).json(users))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

/*** Title APIs ***/


//GET api/title
//Returns the title of the website
app.get('/api/title',
  (req, res) => {
    userDao.getTitle()
      .then(title => res.status(200).json(title))
      .catch((err) => res.status(500).json(err)); // return a json and an error message
  }
);

//PUT api/title
//Updates the title of the website
app.put('/api/title',
  isLoggedIn,
  [check('title').isLength({min: 1, max:30}).withMessage('Title too long')],
  async (req, res) => {

    if(req.user.role!=="Admin"){
      return res.status(401).json({error: 'Not authorized'});
    }

    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const title = req.body.title
    
    try {
      const result = await userDao.updateTitle(title); 
    
      res.status(200).json(title);

    } catch (err) {
      res.status(500).json({ error: `Database error during the update of the title: ${err}` }); 
    }
    
  }
);

/*** Page APIs ***/

// Retrieve the list of all the available pages.
// GET /api/pages

app.get('/api/pages',
  (req, res) => {

    if(req.query.filter==="all"){
      if(!req.user){
        return res.status(401).json({error: 'Not authorized'});
      }
    }
    
    pagesDao.listPages(req.query.filter)
      .then(pages => res.status(200).json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

// Retrieve a page, given its “id”.
// GET /api/pages/<id>
// Given a page id, this route returns the associated page

app.get('/api/pages/:id',
  [ check('id').isInt({min: 1}).withMessage("Id is not an integer") ],    // check: is the id a positive integer
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    try {
      const result = await pagesDao.getPage(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        return res.status(200).json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

app.get('/api/pages/:id/blocks',
  [ check('id').isInt({min: 1}).withMessage("Id is not an integer") ],    // check: is the id a positive integer
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    try {
      const result = await pagesDao.getBlocks(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
        return res.status(200).json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

//Create a new page, by providing all relevant information.
// POST /api/pages

app.post('/api/pages',
  isLoggedIn,
  [
    check('title').isLength({min: 1, max:160}).withMessage("Title too long"),
    // only date (first ten chars) and valid ISO
    check('publicationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}).withMessage("Invalid Date"),
    check('creationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).withMessage("Invalid Date"),
    check("blocks").isArray().withMessage("Invalid blocks"),
    check("blocks.*").notEmpty().withMessage("Empty blocks"),
    check("blocks.*.content").isString().withMessage("Error in the content of blocks")
  ],
  async (req, res) => {
    
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const page = {
      title: req.body.title,
      author: req.user.name,
      creationDate: req.body.creationDate,
      publicationDate: req.body.publicationDate
    };

    const blocks = req.body.blocks

    try {
      const result1 = await pagesDao.createPage(page); // NOTE: createPage returns the new created object
      let position = 1;
      blocks.forEach(async (block) => {
        block.pageid = result1.id
        block.position = position
        position++
        const result2 = await pagesDao.createBlock(block)
      })
      return res.status(201).json(result1);
    } catch (err) {
      res.status(500).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
  }
);

//Update a page, by providing all relevant information and the id.
// PUT /api/pages/<id>

app.put('/api/pages/:id',
  isLoggedIn,
  [
    check('title').isLength({min: 1, max:160}).withMessage("Title too long"),
    // only date (first ten chars) and valid ISO
    check('publicationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}).withMessage("Invalid Date"),
    check('creationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).withMessage("Invalid Date"),
    check("blocks").isArray().withMessage("Invalid blocks"),
    check("blocks.*").notEmpty().withMessage("Empty blocks"),
    check("blocks.*.content").isString().withMessage("Error in the content of blocks")
  ],
  async (req, res) => {

    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const page = {
      id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      creationDate: req.body.creationDate,
      publicationDate: req.body.publicationDate
    };

    const blocks = req.body.blocks
    
    try {

      if(req.user.role!=="Admin"){
        const p = await pagesDao.getPage(req.params.id)
        if (p.error){
          return res.status(404).json(p);
        }else{
          if(p.author!==req.user.name){
            // if a normal user is trying to update a page but it's not the author of that page
            return res.status(401).json({error: 'Not authorized'});
          }
          if(req.body.author!==req.user.name){
            //if a user is trying to update the author of a page for who he is the author
            return res.status(401).json({error: 'Not authorized'});
          }
        }
      }

      const result1 = await pagesDao.updatePage(page.id,page); 
      await pagesDao.deletePageBlocks(page.id)

      let position = 1;
      blocks.forEach(async (block) => {
        block.pageid = page.id
        block.position = position
        position++
        const result2 = await pagesDao.createBlock(block)
      })
      res.status(200).json(result1);
    } catch (err) {
      res.status(500).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
    
  }
);

// Delete an existing page, given its “id”
// DELETE /api/pages/<id>
// Given a page id, this route deletes the associated page from the list.

app.delete('/api/pages/:id',
  isLoggedIn,
  [ check('id').isInt({min: 1}).withMessage("Id is not an integer") ],
  async (req, res) => {

    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    
    try {

      if(req.user.role!=="Admin"){
        const p = await pagesDao.getPage(req.params.id)
        if (p.error){
          return res.status(404).json(p);
        }else{
          if(p.author!==req.user.name){
            return res.status(401).json({error: 'Not authorized'});
          }
        }
      }

      const result2 = await pagesDao.deletePageBlocks(req.params.id)
      if (result2 == null){
        const result = await pagesDao.deletePage(req.params.id);
        if(result == null){
          return res.status(200).json({}); 
        }else{
          return res.status(404).json(result);
        }
      }
      else
        return res.status(404).json(result2);
    } catch (err) {
      res.status(500).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
    }
  }
);


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
