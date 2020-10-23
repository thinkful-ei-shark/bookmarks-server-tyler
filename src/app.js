require('dotenv').config();

// Third Party Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const {v4: uuid} = require('uuid');

// Local Dependencies
const {NODE_ENV} = require('./config');
const app = express();

// Placeholder Variables
const bookmarks = [
  {
    'id': '8sdfbvbs65sd',
    'title': 'Google',
    'url': 'http://google.com',
    'desc': 'An indie search engine startup',
    'rating': 4
  },
  {
    'id': '87fn36vd9djd',
    'title': 'Fluffiest Cats in the World',
    'url': 'http://medium.com/bloggerx/fluffiest-cats-334',
    'desc': 'The only list of fluffy cats online',
    'rating': 5
  }
];

const morganOption = (NODE_ENV === 'production')? 'tiny': 'common';

// Setup Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'info.log'})
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Authorization Middleware
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log('apiToken', apiToken);
  console.log('authToken',authToken);
  if (!authToken || authToken.split(' ')[0] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// Routes
//  All Bookmarks
app.get('/bookmarks', (req,res) => {
  res.json(bookmarks);
});
//  Bookmark by Id
app.get('/bookmarks/:id', (req,res) => {
  const {id} = req.params;
  const bookmark = bookmarks.find(bookmark => bookmark.id === id);

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Bookmark Not Found');
  }
  res.json(bookmark);
});
//  Add Bookmark
app.post('/bookmarks', (req,res) => {
  res.send('POST Request received');
});


// Error Handling Middleware
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV ==='production') {
    response = {error: { message: 'serer error'}};
  }
  else {
    console.error(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;