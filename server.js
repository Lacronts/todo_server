require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const todos = require('./routes/todos');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./config/database');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const app = express();

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDb connection error:', {
    useNewUrlParser: true
  })
);

mongoose.connection.once('open', () =>
  console.log('MongoDb connection established')
);

app.set('secretKey', 'todoRestApi');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', users);
app.use('/todos', validateUser, todos);

app.get('/favicon.ico', function(req, res) {
  res.sendStatus(204);
});

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(
    err,
    decoded
  ) {
    if (err) {
      res
        .status('401')
        .json({ status: 'error', message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404).json({ message: 'Not found' });
  } else if (err.name == 'ValidationError') {
    res.status(400).json({ message: 'Bad Request', error: err.message });
  } else res.status(500).json({ message: 'Something looks wrong :( !!!' });
});

app.listen(3000, function() {
  console.log('node server listening on port 3000');
});
