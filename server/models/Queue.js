const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  name: String,
  phone: String,
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'served', 'not_arrived'],
    default: 'waiting',
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Queue', queueSchema);
