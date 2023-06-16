'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const dayjs = require("dayjs");


exports.listPages = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM pages ORDER BY creation_date ASC;';
      db.all(sql,(err, rows) => {
        if (err) { reject(err); }
  
        const pages = rows.map((e) => {
          const page = Object.assign({}, e, { creationDate: e.creation_date, publicationDate: e.publication_date } ); 
          delete page.creation_date;  // removing
          delete page.publication_date;

          return page;
        });

        resolve(pages);
      });
    });
};