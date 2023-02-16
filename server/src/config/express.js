const express = require('express');
const cookieParser = require('cookie-parser');

// const { auth } = require('./middlewares/authMiddleware');
// const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
const router = require('./router');

module.exports = (app) => {
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static('../public'));

  app.use(cookieParser());

  // app.use(auth);

  // app.use(errorHandler);

  app.use(router);
}
