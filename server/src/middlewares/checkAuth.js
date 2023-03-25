const jwt = require('jsonwebtoken');

const HttpError = require('../utils/httpErrorHelper');

const checkAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(accessToken, process.env.SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};

module.exports = checkAuth;
