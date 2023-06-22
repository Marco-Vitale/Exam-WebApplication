'use strict';

/* Data Access Object (DAO) module for accessing pages data */

const db = require('./db');
const dayjs = require("dayjs");

const currentDate = dayjs();

exports.getPage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: 'Page not found.' });
      } else {
        // WARN: database is case insensitive. Converting "watchDate" to camel case format
        const page = Object.assign({}, row, { creationDate: row.creation_date, publicationDate: row.publication_date } );
        delete page.creation_date;
        delete page.publication_date;

        resolve(page);
      }
    });
  });
};

/**
 * This function adds a new page in the database.
 * The page id is added automatically by the DB, and it is returned as this.lastID.
 */

exports.createPage = (page) => {

  // our database is configured to have a NULL value for pages without publication date

  if (page.publicationDate == "")
    page.publicationDate = null;

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO pages (title, author, creation_date, publication_date) VALUES(?, ?, ?, ?)';
    db.run(sql, [page.title, page.author, page.creationDate, page.publicationDate], function (err) {
      if (err) {
        reject(err);
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getPage(this.lastID));
    });
  });
};

exports.createBlock = (block) => {

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO blocks (pageid, type, content, position) VALUES(?, ?, ?, ?)';
    db.run(sql, [block.pageid, block.type, block.value, block.position], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

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

exports.getBlocks = (pageid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM blocks WHERE pageid=? ORDER BY position ASC';
    db.all(sql,[pageid], (err, rows) => {
      if (err) { reject(err); }

      const blocks = rows.map((e) => {
        const block = Object.assign({}, e); 
        
        return block;
      });

      resolve(blocks);
    });
  });
};

// This function deletes an existing page given its id.
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

exports.deletePageBlocks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM blocks WHERE pageid=?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes === 0)
        resolve({ error: 'No blocks deleted.' });
      else
        resolve(null);
    });
  });
}