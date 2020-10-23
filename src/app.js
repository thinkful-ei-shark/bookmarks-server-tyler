require('dotenv').config();

// Third Party Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Local Dependencies
const {NODE_ENV} = require('./config');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


// Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req,res) => {
  res.send('GET Request received');
});

app.post('/', (req,res) => {
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