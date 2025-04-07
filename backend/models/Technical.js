const mongoose = require('mongoose');

const technicalSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      qno: Number,
      question: String,
      marks: Number,
    },
  ],
  due_date: Date,
  uploaded_date: Date,
  uploaded_by: String,
});

module.exports = mongoose.model('Technical', technicalSchema);
