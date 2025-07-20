// models/Video.js
// Note: This project uses MySQL, not MongoDB
// This file is kept for reference but not used in the actual implementation
// The actual video data is stored in MySQL 'videos' table

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  uploaded_date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  uploaded_by: { type: String, required: true },
});

module.exports = mongoose.model("Video", videoSchema);
