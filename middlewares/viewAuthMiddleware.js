const jwt = require('jsonwebtoken');
require('dotenv').config();

const viewAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/login');
    }
    req.user = decoded;
    next();
  });
};

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (!err) {
        return res.redirect('/tasks');
      }
    });
  }
  next();
};

module.exports = {
  viewAuthMiddleware,
  redirectIfAuthenticated
};