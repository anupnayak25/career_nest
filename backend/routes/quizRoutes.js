const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming db.js exists and works

// Get all quizzes
router.get('/', (req, res) => {
  connection.query("SELECT * FROM quizzess", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a specific quiz's questions
router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send('Quiz not found');
    res.json(results);
  });
});

// Create a new quiz
router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `INSERT INTO quizzess (title, description, upload_date, due_date, totalMarks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update a quiz
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE quizzess SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;

  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// Delete a quiz
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM quizzess WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Quiz deleted");
  });
});

// =================== ANSWER ROUTES ===================

// Submit answers for a quiz
router.post('/answers', (req, res) => {
  const { quiz_id, answers } = req.body;
  const user_id = req.user.id; // assuming you're using authentication middleware

  if (!quiz_id || !answers || answers.length === 0) {
    return res.status(400).json({ error: "quiz_id and answers are required" });
  }

  const insertQuery = `INSERT INTO quiz_answers (quiz_id, user_id, qno, selected_ans, is_correct, marks_awarded) VALUES ?`;

  const answerValues = answers.map(({ qno, selected_ans, is_correct, marks_awarded }) => [
    quiz_id,
    user_id,
    qno,
    selected_ans,
    is_correct ? 1 : 0,
    marks_awarded || 0
  ]);

  connection.query(insertQuery, [answerValues], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Answers submitted successfully" });
  });
});

// Get all users who answered a quiz
router.get('/answers/:quiz_id', (req, res) => {
  const quiz_id = req.params.quiz_id;
  const query = `SELECT DISTINCT user_id FROM quiz_answers WHERE quiz_id = ?`;

  connection.query(query, [quiz_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a specific user's answers for a quiz
router.get('/answers/:quiz_id/:user_id', (req, res) => {
  const { quiz_id, user_id } = req.params;
  const query = `SELECT qno, selected_ans, is_correct, marks_awarded FROM quiz_answers WHERE quiz_id = ? AND user_id = ?`;

  connection.query(query, [quiz_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.put('/publish/:id', (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE quizzess SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});


module.exports = router;
