const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming you have a db.js file for database connection

router.get('/', (req, res) => {
  connection.query("SELECT * FROM quizzess", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send('Post not found');
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `INSERT INTO quizzess (title, description, upload_date, due_date, totalMarks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE quizzess SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM quizzess WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Post deleted");
  });
});
