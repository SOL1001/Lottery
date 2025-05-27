const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: String,
  value: String,
  ticketsLeft: Number,
  ticketPrice: Number,
  image: String,
  endDate: Date,
  category: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
