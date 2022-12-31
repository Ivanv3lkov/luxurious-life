const mongoose = require('mongoose');

module.exports = (connectionString) => mongoose.connect(connectionString);
