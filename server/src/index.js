const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { PORT, DB_CONNECTION_STRING } = process.env;

const databaseInit = require('../config/database');
const expressInit = require('../config/express');

const app = express();

expressInit(app);

databaseInit(DB_CONNECTION_STRING)
  .then(() => {
    console.log('Database connection established!');
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  })
  .catch((err) => {
    console.log('Cannot connect to database:', err);
  });
