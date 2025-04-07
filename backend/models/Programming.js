const mongoose = require('mongoose');

const programmingSchema = new mongoose.Schema({
  title: String,
  language: String,
  code: String,
  explanation: String,
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Programming', programmingSchema);
