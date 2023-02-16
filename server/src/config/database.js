const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

module.exports = () => mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
