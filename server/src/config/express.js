const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const userRoutes = require('../routes/userRoutes');
const homeRoutes = require('../routes/homeRoutes');
const HttpError = require('../utils/httpErrorHelper');

module.exports = (app) => {

  app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.json());

  app.use(express.static('../public'));

  app.use(cookieParser());

  app.use('/uploads/images', express.static(path.join('uploads', 'images')));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

  app.use('/api/homes', homeRoutes);
  app.use('/api/users', userRoutes);

  app.use(() => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

  app.use((error, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, err => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });
}
