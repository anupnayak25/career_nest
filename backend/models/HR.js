const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
  position: String,
  company: String,
  experienceRequired: String,
  description: String,
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HR', hrSchema);
