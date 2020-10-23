require('dotenv').config();

// Third Party Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');

// Local Dependencies
const {NODE_ENV} = require('./config');
const bookmarksRouter = require('./bookmarks/bookmarks-router');
const app = express();

const morganOption = (NODE_ENV === 'production')? 'tiny': 'common';

// Middleware
// Third Party Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Authorization Middleware
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[0] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// Route Middleware
app.use(bookmarksRouter);

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