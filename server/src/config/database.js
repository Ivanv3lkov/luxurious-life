const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

module.exports = () => mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8bzp1gl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
