const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
