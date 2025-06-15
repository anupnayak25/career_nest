const express = require('express');
const router = express.Router();
const connection = require('../db'); // Assuming db.js exists and works

// Get all quizzes
router.get('/', (req, res) => {
  connection.query("SELECT * FROM quizzes", async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
      try {
      const setsWithQuestions = await Promise.all(
        sets.map(set => {
          return new Promise((resolve, reject) => {
            connection.query(
              "SELECT * FROM program_questions WHERE program_set_id = ?",
              [set.id],
              (err, questions) => {
                if (err) return reject(err);
                set.questions = questions;
                resolve(set);
              }
            );
          });
        })
      );

      res.json(setsWithQuestions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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
  const { title, description, upload_date, due_date, user_id, quizQuestions } = req.body;
  
  // First, insert the quiz
  const query = `INSERT INTO quizzes (title, description, upload_date, due_date, user_id, display_result)
                 VALUES (?, ?, ?, ?, ?, 0)`;
  
  connection.query(query, [title, description, upload_date, due_date, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const quiz_id = result.insertId;
    
    // If there are no quiz questions to insert, return early
    if (!quizQuestions || !quizQuestions.length) {
      return res.status(201).json({ 
        message: "Quiz created successfully with no questions",
        id: quiz_id, 
        ...req.body 
      });
    }
    
    // Insert quiz questions
    const queryInsertQuestion = `
      INSERT INTO quiz_questions (quiz_id, qno, question, options, marks, correct_ans)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Convert each question insert into a Promise
    const insertQuestionPromises = quizQuestions.map(({ qno, question, options, marks, correct_ans }) => {
      // Ensure options is a JSON string
      const optionsString = typeof options === 'string' ? options : JSON.stringify(options);
      
      return new Promise((resolve, reject) => {
        connection.query(queryInsertQuestion, [quiz_id, qno, question, optionsString, marks, correct_ans], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
    
    // Wait for all inserts to finish
    Promise.all(insertQuestionPromises)
      .then(() => {
        // Calculate total marks from all questions
        const totalMarks = quizQuestions.reduce((sum, question) => sum + question.marks, 0);
        
        // Update the quiz with the calculated total marks
        const updateTotalMarksQuery = `UPDATE quizzes SET totalMarks = ? WHERE id = ?`;
        connection.query(updateTotalMarksQuery, [totalMarks, quiz_id], (err) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
              message: "Quiz and questions created but failed to update total marks"
            });
          }
          
          res.status(201).json({
            message: "Quiz and questions created successfully",
            id: quiz_id,
            totalMarks: totalMarks,
            ...req.body
          });
        });
      })
      .catch(error => {
        res.status(500).json({ 
          error: error.message,
          message: "Failed to create quiz questions"
        });
      });
  });
});

// Update a quiz
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE quizzes SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;

  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// Delete a quiz
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM quizzes WHERE id = ?", [id], (err) => {
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
  const query = `UPDATE quizzes SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});


module.exports = router;
