const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  homes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Home' }],
  cars:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Car' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
