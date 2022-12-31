const express = require('express');
const cookieParser = require('cookie-parser');

const router = require('./router');
// const { auth } = require('./middlewares/authMiddleware');
// const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
// app.use(auth);
// app.use(errorHandler);

module.exports = (app) => {

  app.use(express.urlencoded({ extended: false }));

  app.use(express.static('../public'));

  app.use(cookieParser());

  app.use(router);
}
