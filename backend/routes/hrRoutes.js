const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming you have a db.js file for database connection
const fetchUser = require('../middlewares/fetchUser');


router.get('/', fetchUser, (req, res) => {
  connection.query("SELECT * FROM hr_questions", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM hr_question_items WHERE hr_question_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send('HR Post not found');
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `INSERT INTO hr_questions (title, description, upload_date, due_date, totalMarks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE hr_questions SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM hr_questions WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("HR Post deleted");
  });
});


//andwer routes here

router.post('/answers', (req,res) => {
  const { hr_question_id, user_id, qno, answer } = req.body;
  try {
    connection.query(
      'INSERT INTO hr_answers (hr_question_id, user_id, qno, answer) VALUES (?, ?, ?, ?)',
      [hr_question_id, user_id, qno, answer]
    );
    res.status(201).json({ message: 'HR answer added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/answers/:id', fetchUser, (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM hr_ansewrs where hr_question_id=?", [id],(err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/answers/:id/:user_id', fetchUser, (req, res) => {
  const { id, user_id } = req.params;
  connection.query("SELECT * FROM hr_answers where hr_question_id=? and user_id=?", [id, user_id],(err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



module.exports = router;
