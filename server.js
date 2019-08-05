require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const todos = require('./routes/todos');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./config/database');
const cors = require('cors');
const app = express();
const CONSTANTS = require('./app/api/constants/');
const validateUser = require('./helpers/validateUser');

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDb connection error:')
);

mongoose.connection.once('open', () =>
  console.log('MongoDb connection established')
);

app.set('secretKey', process.env.SECRET_KEY);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({ extended: true }));

const baseUrl = `/api/${CONSTANTS.API_VERSION.v1}`;

app.use(`${baseUrl}/users`, users);
app.use(`${baseUrl}/todos`, validateUser, todos);

app.get('/favicon.ico', function(req, res) {
  res.sendStatus(204);
});

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404).json({ message: 'Not found' });
  } else if (err.name == 'ValidationError' || err.code === 400) {
    const details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
    console.log(details);
    res.status(400).json({ message: 'Bad Request', error: { details } });
  } else res.status(500).json({ message: 'Something looks wrong :( !!!' });
});

const server = app.listen(process.env.PORT || 8080, function() {
  console.log(`node server listening on port ${server.address().port}`);
});
