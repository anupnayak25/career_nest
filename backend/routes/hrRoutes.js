const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming you have a db.js file for database connection
const fetchUser = require('../middlewares/fetchUser');


router.get('/', (req, res) => {
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
  const { hrQuestion, hrQuestionItems } = req.body;
  const { title, description, due_date, totalMarks } = hrQuestion;

  const queryInsertHR = `
    INSERT INTO hr_questions (title, description, due_date, totalMarks, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(queryInsertHR, [title, description, due_date, totalMarks, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const hr_question_id = result.insertId;

    const queryInsertItem = `
      INSERT INTO hr_question_items (hr_question_id, qno, question, marks)
      VALUES (?, ?, ?, ?)
    `;

    // Convert each item insert into a Promise
    const insertItemPromises = hrQuestionItems.map(({ qno, question, marks }) => {
      return new Promise((resolve, reject) => {
        connection.query(queryInsertItem, [hr_question_id, qno, question, marks], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    // Wait for all inserts to finish
    Promise.all(insertItemPromises)
      .then(() => {
        res.status(201).json({
          message: "questions uploaded successfully",
          id: hr_question_id
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { hrQuestion, hrQuestionItems } = req.body;
  const { title, description, due_date, totalMarks } = hrQuestion;

  const queryUpdatetHR = `
    UPDATE hr_questions set title = ?, description = ?, upload_date = ?, due_date = ?, totalMarks = ? where user_id = ? and id=?`;

  connection.query(queryUpdatetHR, [title, description, new Date(), due_date, totalMarks, req.user.id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const queryUpdateItem = `
      UPDATE hr_question_items set  question =?, marks=? where hr_question_id = ? and qno = ?
    `;

    // Convert each item insert into a Promise
    const insertItemPromises = hrQuestionItems.map(({ qno, question, marks }) => {
      return new Promise((resolve, reject) => {
        connection.query(queryUpdateItem, [question, marks, id, qno], (err, result) => {
          if (err) return reject(err);

          resolve(result);
        });
      });
    });

    // Wait for all inserts to finish
    Promise.all(insertItemPromises)
      .then(() => {
        res.status(201).json({
          message: "questions updated successfully"
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM hr_questions WHERE id = ? and user_id=? ", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    else if (result.affectedRows == 0) return res.status(404).json({
      message: "HR post not found"
    });
    res.status(201).json({
      message: "HR post deleted successfully"
    });
  });
});

router.delete('/:id/:qno', (req, res) => {
  const id = req.params.id;
  const qno = req.params.qno;


  connection.query("select user_id from hr_questions where id = ?", [id], (err, result) => {
    console.log(result);

    if (result.length == 0) {
      res.status(404).json({
        message: "Post not found",
      });
    }
    else if (result[0].user_id == req.user.id) {
      connection.query("DELETE FROM hr_question_items WHERE hr_question_id = ? and qno=?", [id, qno], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        else if (result.affectedRows == 0) return res.status(404).json({
          message: "question not found"
        });
        res.status(201).json({
          message: "Question deleted successfully",
        });
      });
    }
    else {
      res.status(401).json({
        message: "deletion not permitted for this users"
      });
    }
  })


});


//answer routes here

router.post('/answers', (req, res) => {
  const { hr_question_id, answers } = req.body;


  const query = `
      'INSERT INTO hr_answers (hr_question_id, user_id, qno, answer) VALUES (?, ?, ?, ?)'
    `;

  connection.query("select user_id from hr_answers where hr_question_id = ? and user_id = ? group by user_id", [hr_question_id, req.user.id], (error, results) => {

    if (results.length == 0) {
      // Convert each item insert into a Promise
      const insertItemPromises = answers.map(({ qno, answer }) => {
        return new Promise((resolve, reject) => {
          connection.query(query, [hr_question_id, req.user.id, qno, answer], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      });

      // Wait for all inserts to finish
      Promise.all(insertItemPromises)
        .then(() => {
          res.status(201).json({
            message: "answers uploaded successfully",
            id: hr_question_id
          });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
    else {
      res.status(401).json({
        message: "answer already submitted",
        id: hr_question_id
      });
    }
  });


});


router.get('/answers/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT user_id FROM hr_answers where hr_question_id=? and (select user_id from hr_questions where id = ?)=? group by  user_id", [id, id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length == 0) return res.status(404).json({ message: "No answers yet" });
    res.json(results);
  });
});

router.get('/answers/:id/:user_id', (req, res) => {
  const id = req.params.id;
  const user_id = req.params.user_id;
  connection.query("SELECT qno, answer FROM hr_answers where hr_question_id=? and  user_id = ? and (select user_id from hr_questions where id = ?)=?", [id, user_id, id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length == 0) return res.status(404).json({ message: "No answers yet" });
    res.json(results);
  });
});







/*TODO*/
router.put('/publish/:id', (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE hr_questions SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});


module.exports = router;
