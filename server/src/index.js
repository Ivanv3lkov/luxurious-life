const express = require('express');
const dotenv = require('dotenv');

const initializeDatabase = require('./config/database');
const initializeExpress = require('./config/express');

dotenv.config();

const app = express();

initializeExpress(app);

initializeDatabase()
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}!`));
  })
  .catch((error) => {
    console.log('Cannot connect to database:', error);
  });
