const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('../routes');

module.exports = (app) => {

  app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.json());

  app.use(express.static('../public'));

  app.use(cookieParser());

  app.use(routes);
}
