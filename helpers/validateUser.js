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
      req.body.userId = decoded.id;
      next();
    }
  });
}

module.exports = validateUser;
