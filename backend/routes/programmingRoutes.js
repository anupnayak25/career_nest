const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming you have a db.js file for database connection

router.get('/', (req, res) => {
  connection.query("SELECT * FROM program_sets", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM program_questions WHERE program_set_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send('Post not found');
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `INSERT INTO program_sets (title, description, upload_date, due_date, totalMarks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE program_sets SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM program_sets WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Post deleted");
  });
});


// POST /answers: Submit all answers
router.post('/answers', (req, res) => {
  const { program_set_id, answers } = req.body;
  
  const query = `
    INSERT INTO program_answers (program_set_id, user_id, qno, submitted_code)
    VALUES (?, ?, ?, ?)
  `;
  
  const insertItemPromises = answers.map(({ qno, answer }) => {
    return new Promise((resolve, reject) => {
      connection.query(query, [program_set_id, req.user.id, qno, answer], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(insertItemPromises)
    .then(() => {
      res.status(201).json({
        message: "Answers uploaded successfully",
        program_set_id: program_set_id
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// GET /answers/:id: List of users who answered a set
router.get('/answers/:id', (req, res) => {
  const program_set_id = req.params.id;
  
  connection.query(
    `SELECT DISTINCT user_id FROM program_answers WHERE program_set_id = ?`,
    [program_set_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "No answers yet" });
      res.json(results);
    }
  );
});

// GET /answers/:id/:user_id: Get specific user's answers
router.get('/answers/:id/:user_id', (req, res) => {
  const program_set_id = req.params.id;
  const user_id = req.params.user_id;

  connection.query(
    `SELECT qno, submitted_code FROM program_answers WHERE program_set_id = ? AND user_id = ?`,
    [program_set_id, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "No answers yet" });
      res.json(results);
    }
  );
});

/*TODO*/
router.put('/publish/:id', (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE program_sets SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});


module.exports = router;
