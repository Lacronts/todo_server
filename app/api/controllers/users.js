const userModel = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  create: function(req, res, next) {
    userModel.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      },
      function(err) {
        if (err) next(err);
        else
          res.json({
            status: 'success',
            message: 'Registration completed successfully. Please Sign In now',
            data: null
          });
      }
    );
  },
  authenticate: function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, userInfo) {
      if (err) {
        next(err);
      } else if (!userInfo) {
        let error = new Error('Invalid email/password!!!');
        error.code = 400;
        next(error);
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get('secretKey'),
            {
              expiresIn: '30d'
            }
          );
          res.json({
            status: 'success',
            message: 'user found!!!',
            data: { user: userInfo, token: token }
          });
        } else {
          res.json({
            status: 'error',
            message: 'Invalid email/password!!!',
            data: null
          });
        }
      }
    });
  }
};
