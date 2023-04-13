const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  reactions: {
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    hearts: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    diamonds: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  }
});

module.exports = mongoose.model('Home', homeSchema);
