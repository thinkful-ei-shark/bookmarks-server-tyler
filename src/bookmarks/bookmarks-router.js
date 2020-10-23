// Third Party Dependencies
const express = require('express');
const {v4: uuid} = require('uuid');
const logger = require('../logger');

// Local Dependencies
const {PORT} = require('../config');
const bookmarks = require('../store');

// Middleware
const bookmarksRouter = express.Router();
const bodyParser = express.json();

// Routes
bookmarksRouter
  .route('/bookmarks')
  //  GET All Bookmarks
  .get((req,res) => {
    res.json(bookmarks);
  })
  //  POST New Bookmark
  .post(bodyParser, (req,res) => {
    const {title, url, desc, rating} = req.body;

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!url) {
      logger.error('Url is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!desc) {
      logger.error('Desc is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    bookmarks.push(bookmark);

    logger.info(`Card with id ${id} created`);

    res
      .status(201)
      .location(`${PORT}/bookmarks/${id}`)
      .json(bookmark);
  });
bookmarksRouter
  .route('/bookmarks/:id')
  //  GET Bookmark by Id
  .get((req,res) => {

    const {id} = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id === id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  //  DELETE Bookmark by Id
  .delete((req,res) => {
    const {id} = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark=> bookmark.id === id);

    if(bookmarkIndex===-1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.)`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter;