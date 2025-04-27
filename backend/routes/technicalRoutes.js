const express = require('express');
const router = express.Router();
const connection = require('../db'); // make sure your db.js is correct

// Create a new technical set
router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id, questions } = req.body;
  const insertSetQuery = `INSERT INTO technical_questions (title, description, upload_date, due_date, totalMarks, user_id) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(insertSetQuery, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const technicalQuestionId = result.insertId;

    // Insert related questions
    const insertQuestionsQuery = `INSERT INTO technical_question_items (technical_question_id, qno, question, marks) VALUES ?`;
    const values = questions.map(q => [technicalQuestionId, q.qno, q.question, q.marks]);

    connection.query(insertQuestionsQuery, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ id: technicalQuestionId, title, description, upload_date, due_date, totalMarks, user_id, questions });
    });
  });
});

// Get all technical sets
router.get('/', (req, res) => {
  connection.query('SELECT * FROM technical_questions', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single technical set + its questions
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const setQuery = `SELECT * FROM technical_questions WHERE id = ?`;
  const questionsQuery = `SELECT qno, question, marks FROM technical_question_items WHERE technical_question_id = ?`;

  connection.query(setQuery, [id], (err, setResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (setResults.length === 0) return res.status(404).send('Technical set not found');

    connection.query(questionsQuery, [id], (err2, questionsResults) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const response = { ...setResults[0], questions: questionsResults };
      res.json(response);
    });
  });
});

// Update a technical set (only main info)
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const updateQuery = `UPDATE technical_questions SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;

  connection.query(updateQuery, [title, description, upload_date, due_date, totalMarks, user_id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, title, description, upload_date, due_date, totalMarks, user_id });
  });
});

// Delete a technical set
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  // Delete questions first, then the set
  connection.query('DELETE FROM technical_question_items WHERE technical_question_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    connection.query('DELETE FROM technical_questions WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.send('Technical set and its questions deleted');
    });
  });
});


//================= ANSWERS API ==================

// Submit answers
router.post('/answers', (req, res) => {
  const { technical_question_id, answers } = req.body;
  const user_id = req.user.id; // assuming req.user.id is set after auth middleware

  const insertAnswerQuery = `INSERT INTO technical_answers (technical_id, user_id, qno, answer) VALUES ?`;
  const values = answers.map(({ qno, answer }) => [technical_question_id, user_id, qno, answer]);

  connection.query(insertAnswerQuery, [values], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Answers submitted successfully", technical_question_id });
  });
});

// Get users who submitted answers for a technical set
router.get('/answers/:id', (req, res) => {
  const technical_question_id = req.params.id;
  const query = `SELECT DISTINCT user_id FROM technical_answers WHERE technical_question_id = ?`;

  connection.query(query, [technical_question_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No answers found" });
    res.json(results);
  });
});

// Get all answers of a specific user for a technical set
router.get('/answers/:id/:user_id', (req, res) => {
  const { id, user_id } = req.params;
  const query = `SELECT qno, answer FROM technical_answers WHERE technical_question_id = ? AND user_id = ?`;

  connection.query(query, [id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No answers found" });
    res.json(results);
  });
});

router.put('/publish/:id', (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE technical_questions SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});


module.exports = router;
