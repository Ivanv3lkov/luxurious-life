const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  reactions: {
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    hearts: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    diamonds: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  }
});

module.exports = mongoose.model('Car', carSchema);
