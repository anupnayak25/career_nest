const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  category: String,
  uploaded_date: Date,
  discription: String,
  uploaded_by: String,
});

module.exports = mongoose.model('Video', videoSchema);
