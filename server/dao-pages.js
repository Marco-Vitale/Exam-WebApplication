'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const dayjs = require("dayjs");

const currentDate = dayjs();

exports.listPages = (filter) => {
    return new Promise((resolve, reject) => {
      const sql = filter==="all" ? 'SELECT * FROM pages ORDER BY creation_date ASC;' : 'SELECT * FROM pages WHERE publication_date IS NOT NULL ORDER BY publication_date ASC;';
      db.all(sql,(err, rows) => {
        if (err) { reject(err); }
  
        const pages = rows.map((e) => {
          const page = Object.assign({}, e, { creationDate: e.creation_date, publicationDate: e.publication_date } ); 
          delete page.creation_date;  // removing
          delete page.publication_date;

          return page;
        });

        if(filter==="published"){
          const filteredPages = pages.filter((page) => {
            const publicationDate = dayjs(page.publicationDate, 'YYYY-MM-DD');
            return publicationDate.isSame(currentDate, 'day') || publicationDate.isBefore(currentDate, 'day');
            });

          resolve(filteredPages);
        }

        resolve(pages);
      });
    });
};

// This function deletes an existing film given its id.
exports.deletePage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM pages WHERE id=?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1)
        resolve({ error: 'No page deleted.' });
      else
        resolve(null);
    });
  });
}