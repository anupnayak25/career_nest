const express = require("express");
const router = express.Router();
const connection = require("../db"); // Assuming you have a db.js file for database connection
const { set } = require("mongoose");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM program_sets", async (err, sets) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const setsWithQuestions = await Promise.all(
        sets.map((set) => {
          return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM program_questions WHERE program_set_id = ?", [set.id], (err, questions) => {
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

router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM program_questions WHERE program_set_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send("Post not found");
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id, programQuestions } = req.body;

  // Insert the program set first
  const query = `INSERT INTO program_sets (title, description, publish_date, due_date, total_marks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const program_set_id = result.insertId;

    // If there are no program questions to insert, return early
    if (!programQuestions || !programQuestions.length) {
      return res.status(201).json({
        message: "Program set created successfully with no questions",
        id: program_set_id,
        ...req.body,
      });
    }

    // Insert program questions
    const queryInsertQuestion = `
      INSERT INTO program_questions (program_set_id, qno, question, program_snippet, marks)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Convert each question insert into a Promise
    const insertQuestionPromises = programQuestions.map(({ qno, question, program_snippet, marks }) => {
      return new Promise((resolve, reject) => {
        connection.query(
          queryInsertQuestion,
          [program_set_id, qno, question, program_snippet, marks],
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
        res.status(201).json({
          message: "Program set and questions created successfully",
          id: program_set_id,
          ...req.body,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "Failed to create program questions",
        });
      });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE program_sets SET title=?, description=?, publish_date=?, due_date=?, total_marks=?, user_id=? WHERE id=?`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM program_sets WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Post deleted");
  });
});

// POST /answers: Submit all answers
router.post("/answers", (req, res) => {
  const { program_id, answers } = req.body;

  const query = `
    INSERT INTO program_answers (program_set_id, user_id, qno, submitted_code)
    VALUES (?, ?, ?, ?)
  `;

  const insertItemPromises = answers.map(({ qno, answer }) => {
    return new Promise((resolve, reject) => {
      connection.query(query, [program_id, req.user.id, qno, answer], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(insertItemPromises)
    .then(() => {
      res.status(201).json({
        message: "Answers uploaded successfully",
        program_id: program_id,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// GET /answers/:id: List of users who answered a set
router.get("/answers/:id", (req, res) => {
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
router.get("/answers/:id/:user_id", (req, res) => {
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
router.put("/publish/:id", (req, res) => {
  const id = req.params.id;
  const { display_result } = req.body;
  const query = `UPDATE program_sets SET display_result=? WHERE id=?`;
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
    SELECT DISTINCT program_set_id 
    FROM program_answers 
    WHERE user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const attemptedIds = results.map((row) => row.program_set_id);
    res.json({ attempted: attemptedIds });
  });
});

// Update marks for a specific user's answers
router.put("/answers/:program_set_id/:user_id/marks", (req, res) => {
  const { program_set_id, user_id } = req.params;
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: "updates array is required" });
  }

  const updatePromises = updates.map(({ qno, marks_awarded }) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE program_answers SET marks_awarded = ? WHERE program_set_id = ? AND user_id = ? AND qno = ?`;
      connection.query(query, [marks_awarded, program_set_id, user_id, qno], (err, result) => {
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
