const express = require("express");
const router = express.Router();
const connection = require("../db"); // make sure your db.js is correct

// Create a new technical set
router.post("/", (req, res) => {
  const { title, description, publish_date, due_date, user_id, questions } = req.body;
  // Auto-calculate total_marks
  const totalMarks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  const insertSetQuery = `INSERT INTO technical_questions (title, description, publish_date, due_date, total_marks, user_id) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(insertSetQuery, [title, description, publish_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const technicalId = result.insertId;

    // Insert related questions
    const insertQuestionsQuery = `INSERT INTO technical_question_items (technical_id, qno, question, marks) VALUES ?`;
    const values = questions.map((q) => [technicalId, q.qno, q.question, q.marks]);

    connection.query(insertQuestionsQuery, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res
        .status(201)
        .json({ id: technicalId, title, description, publish_date, due_date, totalMarks, user_id, questions });
    });
  });
});

// Get all technical sets
router.get("/", (req, res) => {
  connection.query("SELECT * FROM technical_questions", async (err, sets) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const setsWithQuestions = await Promise.all(
        sets.map((set) => {
          return new Promise((resolve, reject) => {
            connection.query(
              "SELECT * FROM technical_question_items WHERE technical_id= ?",
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

// Get a single technical set + its questions
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const setQuery = `SELECT * FROM technical_questions WHERE id = ?`;
  const questionsQuery = `SELECT qno, question, marks FROM technical_question_items WHERE technical_question_id = ?`;

  connection.query(setQuery, [id], (err, setResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (setResults.length === 0) return res.status(404).json({ message: "Technical set not found" });

    connection.query(questionsQuery, [id], (err2, questionsResults) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const response = { ...setResults[0], questions: questionsResults };
      res.json(response);
    });
  });
});

// Update a technical set (main info and questions)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, publish_date, due_date, user_id, questions } = req.body;
  // Auto-calculate total_marks
  const totalMarks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  const updateQuery = `UPDATE technical_questions SET title=?, description=?, publish_date=?, due_date=?, total_marks=?, user_id=? WHERE id=?`;

  connection.query(updateQuery, [title, description, publish_date, due_date, totalMarks, user_id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    // Remove old questions and insert new ones
    connection.query("DELETE FROM technical_question_items WHERE technical_id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const insertQuestionsQuery = `INSERT INTO technical_question_items (technical_id, qno, question, marks) VALUES ?`;
      const values = questions.map((q) => [id, q.qno, q.question, q.marks]);
      connection.query(insertQuestionsQuery, [values], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ id, title, description, publish_date, due_date, totalMarks, user_id, questions });
      });
    });
  });
});

// Delete a technical set
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Delete questions first, then the set
  connection.query("DELETE FROM technical_question_items WHERE technical_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    connection.query("DELETE FROM technical_questions WHERE id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.send("Technical set and its questions deleted");
    });
  });
});

//================= ANSWERS API ==================

// Submit answers
router.post("/answers", (req, res) => {
  const { technical_id, answers } = req.body;
  const user_id = req.user.id; // assuming req.user.id is set after auth middleware

  const insertAnswerQuery = `INSERT INTO technical_answers (technical_id, user_id, qno, answer) VALUES ?`;
  const values = answers.map(({ qno, answer }) => [technical_id, user_id, qno, answer]);

  connection.query(insertAnswerQuery, [values], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Answers submitted successfully", technical_id });
  });
});

// Get users who submitted answers for a technical set
router.get("/answers/:id", (req, res) => {
  const technical_question_id = req.params.id;
  const query = `SELECT DISTINCT user_id FROM technical_answers WHERE technical_question_id = ?`;

  connection.query(query, [technical_question_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No answers found" });
    res.json(results);
  });
});

// Get all answers of a specific user for a technical set
router.get("/answers/:id/:user_id", (req, res) => {
  const { id, user_id } = req.params;
  const query = `SELECT * FROM technical_answers WHERE technical_id = ? AND user_id = ?`;

  connection.query(query, [id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No answers found" });
    res.json(results);
  });
});

router.put("/publish/:id", (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE technical_questions SET display_result=? WHERE id=?`;
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
    SELECT DISTINCT technical_id 
    FROM technical_answers 
    WHERE user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const attemptedIds = results.map((row) => row.technical_id);
    res.json({ attempted: attemptedIds });
  });
});

// Update marks for a specific user's answers
router.put("/answers/:technical_id/:user_id/marks", (req, res) => {
  const { technical_id, user_id } = req.params;
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: "updates array is required" });
  }

  const updatePromises = updates.map(({ qno, marks_awarded }) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE technical_answers SET marks_awarded = ? WHERE technical_id = ? AND user_id = ? AND qno = ?`;
      connection.query(query, [marks_awarded, technical_id, user_id, qno], (err, result) => {
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

// Get all posts by the logged-in user
router.get("/myposts", (req, res) => {
  const userId = req.user.id;
  connection.query("SELECT * FROM technical_questions WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
