const express = require('express');
const router = express.Router();

let quizzes = [];

router.post('/', (req, res) => {
  const quiz = { id: Date.now(), ...req.body };
  quizzes.push(quiz);
  res.status(201).json(quiz);
});

router.get('/', (req, res) => {
  res.json(quizzes);
});

router.get('/:id', (req, res) => {
  const quiz = quizzes.find(q => q.id == req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  res.json(quiz);
});

router.put('/:id', (req, res) => {
  const index = quizzes.findIndex(q => q.id == req.params.id);
  if (index === -1) return res.status(404).send('Quiz not found');
  quizzes[index] = { ...quizzes[index], ...req.body };
  res.json(quizzes[index]);
});

router.delete('/:id', (req, res) => {
  quizzes = quizzes.filter(q => q.id != req.params.id);
  res.send('Quiz deleted');
});

module.exports = router;
