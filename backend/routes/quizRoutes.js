const express = require("express");
const router = express.Router();
const connection = require("../db"); // Assuming db.js exists and works
const { body } = require("express-validator");

// Get all quizzes
router.get("/", (req, res) => {
  connection.query("SELECT * FROM quizzes", async (err, sets) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const setsWithQuestions = await Promise.all(
        sets.map((set) => {
          return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [set.id], (err, questions) => {
              if (err) return reject(err);
              set.questions = questions;
              resolve(set);
            });
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
router.get("/student/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT id, quiz_id, qno, question, options, marks FROM quiz_questions WHERE quiz_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).send("Quiz not found");
      res.json(results);
    }
  );
});

// Create a new quiz
router.post("/", [body("title", "Must have a title").notEmpty()], (req, res) => {
  const { title, description, due_date, quizQuestions } = req.body;
  console.log("Received Data:", req.body);
  console.log("User:", req.user); // Ensure user is not undefined

  // First, insert the quiz
  const query = `INSERT INTO quizzes (title, description, due_date, user_id)
                 VALUES (?, ?, ?, ?)`;

  connection.query(query, [title, description, due_date, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const quiz_id = result.insertId;

    // If there are no quiz questions to insert, return early
    if (!quizQuestions || !quizQuestions.length) {
      return res.status(201).json({
        message: "Quiz created successfully with no questions",
        id: quiz_id,
        ...req.body,
      });
    }

    // Insert quiz questions
    const queryInsertQuestion = `
      INSERT INTO quiz_questions (quiz_id, qno, question, options, marks, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Convert each question insert into a Promise
    const insertQuestionPromises = quizQuestions.map(({ question, options, marks, correct_ans }, index) => {
      // Ensure options is a JSON string
      const optionsString = typeof options === "string" ? options : JSON.stringify(options);

      return new Promise((resolve, reject) => {
        connection.query(
          queryInsertQuestion,
          [quiz_id, index + 1, question, optionsString, marks, correct_ans],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    });

    // Wait for all inserts to finish
    Promise.all(insertQuestionPromises)
      .then(() => {
        // Calculate total marks from all questions
        const totalMarks = quizQuestions.reduce((sum, question) => sum + question.marks, 0);

        // Update the quiz with the calculated total marks
        const updateTotalMarksQuery = `UPDATE quizzes SET total_marks = ? WHERE id = ?`;
        connection.query(updateTotalMarksQuery, [totalMarks, quiz_id], (err) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
              message: "Quiz and questions created but failed to update total marks",
            });
          }

          res.status(201).json({
            message: "Quiz and questions created successfully",
            id: quiz_id,
            totalMarks: totalMarks,
            ...req.body,
          });
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "Failed to create quiz questions",
        });
      });
  });
});

// Update a quiz
router.put("/:id", (req, res) => {
  const quiz_id = req.params.id;
  const { title, description, due_date, quizQuestions } = req.body;
  const query = `UPDATE quizzes SET title=?, description=?, due_date=?, user_id=? WHERE id=?`;

  connection.query(query, [title, description, due_date, req.user.id, quiz_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // If there are no quiz questions to insert, return early
    if (!quizQuestions || !quizQuestions.length) {
      return res.status(201).json({
        message: "Quiz updated successfully with no questions",
        id: quiz_id,
        ...req.body,
      });
    }

    // Insert quiz questions
    const queryInsertQuestion = `
      INSERT INTO quiz_questions (quiz_id, qno, question, options, marks, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query("delete from quiz_questions where quiz_id = ?", [quiz_id], (err, result) => {
      if (err) return err;

      // Convert each question insert into a Promise
      const insertQuestionPromises = quizQuestions.map(({ question, options, marks, correct_ans }, index) => {
        // Ensure options is a JSON string
        const optionsString = typeof options === "string" ? options : JSON.stringify(options);

        return new Promise((resolve, reject) => {
          connection.query(
            queryInsertQuestion,
            [quiz_id, index + 1, question, optionsString, marks, correct_ans],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });
      });

      // Wait for all inserts to finish
      Promise.all(insertQuestionPromises)
        .then(() => {
          // Calculate total marks from all questions
          const totalMarks = quizQuestions.reduce((sum, question) => sum + question.marks, 0);

          // Update the quiz with the calculated total marks
          const updateTotalMarksQuery = `UPDATE quizzes SET total_marks = ? WHERE id = ?`;
          connection.query(updateTotalMarksQuery, [totalMarks, quiz_id], (err) => {
            if (err) {
              return res.status(500).json({
                error: err.message,
                message: "Quiz and questions updated but failed to update total marks",
              });
            }

            res.status(201).json({
              message: "Quiz and questions updated successfully",
              id: quiz_id,
              totalMarks: totalMarks,
              ...req.body,
            });
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error.message,
            message: "Failed to updat quiz questions",
          });
        });
    });
  });
});

// Delete a quiz
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM quizzes WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Quiz deleted");
  });
});

router.get("/user/:id", (req, res) => {
  connection.query("SELECT * FROM quizzes WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/mypost/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM quizzes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).send("Quiz not found");
    connection.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [id], (err1, results) => {
      if (err1) return res.status(500).json({ error: err.message });
      res.json({ quiz: result, questions: results });
    });
  });
});

// =================== ANSWER ROUTES ===================

// Submit answers for a quiz
router.post("/answers", (req, res) => {
  const { quiz_id, answers } = req.body;
  const user_id = req.user.id; // assuming you're using authentication middleware

  if (!quiz_id || !answers || answers.length === 0) {
    return res.status(400).json({ error: "quiz_id and answers are required" });
  }

  const insertQuery = `INSERT INTO quiz_answers (quiz_id, user_id, qno, answer, marks_awarded) VALUES ?`;

  const answerValues = answers.map(({ qno, selected_ans, marks_awarded }) => [
    quiz_id,
    user_id,
    qno,
    selected_ans,
    marks_awarded || 0,
  ]);

  connection.query(insertQuery, [answerValues], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Answers submitted successfully" });
  });
});

// Get all users who answered a quiz
router.get("/answers/:quiz_id", (req, res) => {
  const quiz_id = req.params.quiz_id;
  const query = `SELECT DISTINCT user_id FROM quiz_answers WHERE quiz_id = ?`;

  connection.query(query, [quiz_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a specific user's answers for a quiz
router.get("/answers/:quiz_id/:user_id", (req, res) => {
  const { quiz_id, user_id } = req.params;
  const query = `SELECT qno, answer, marks_awarded FROM quiz_answers WHERE quiz_id = ? AND user_id = ?`;

  connection.query(query, [quiz_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.put("/publish/:id", (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE quizzes SET display_result=? WHERE id=?`;
  connection.query(query, [display_result], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.get("/attempted/:id", (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  const query = `
    SELECT DISTINCT quiz_id 
    FROM quiz_answers 
    WHERE user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const attemptedQuizIds = results.map((row) => row.quiz_id);
    res.json({ attempted: attemptedQuizIds });
  });
});

// Update marks for a specific user's answers
router.put("/answers/:quiz_id/:user_id/marks", (req, res) => {
  const { quiz_id, user_id } = req.params;
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: "updates array is required" });
  }

  const updatePromises = updates.map(({ qno, marks_awarded }) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE quiz_answers SET marks_awarded = ? WHERE quiz_id = ? AND user_id = ? AND qno = ?`;
      connection.query(query, [marks_awarded, quiz_id, user_id, qno], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.json({ message: "Marks updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
