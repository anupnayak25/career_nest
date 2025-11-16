const express = require("express");
const router = express.Router();
const connection = require("../db"); // Assuming you have a db.js file for database connection
const { transcribe, AI_SERVER_URL } = require("../services/aiClient");
//const fetchUser = require('../middlewares/fetchUser');
router.get("/", (req, res) => {
  connection.query("SELECT * FROM hr_questions", async (err, sets) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const setsWithQuestions = await Promise.all(
        sets.map((set) => {
          return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM hr_question_items WHERE hr_question_id = ?", [set.id], (err, questions) => {
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
  connection.query("SELECT * FROM hr_question_items WHERE hr_question_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send("HR Post not found");
    res.json(results);
  });
});

router.get("/user/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM hr_questions WHERE user_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send("HR Post not found");
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { hrQuestion, hrQuestionItems } = req.body;
  const { title, description, publish_date, due_date, totalMarks } = hrQuestion;

  const queryInsertHR = `
    INSERT INTO hr_questions (title, description, publish_date, due_date, total_marks, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    queryInsertHR,
    [title, description, publish_date, due_date, totalMarks, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const hr_question_id = result.insertId;

      const queryInsertItem = `
  INSERT INTO hr_question_items (hr_question_id, qno, question, marks, answer_url, answer_transcript)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Helper to build public URL if a filename is provided
      const makeVideoUrl = (val) => {
        if (!val) return null;
        if (/^https?:\/\//i.test(val)) return val;
        const base = process.env.BACKEND_PUBLIC_BASE || "http://localhost:5000";
        return `${base}/videos/${val}`;
      };

      // Insert each item; if a video is provided (answer_url/video/videoUrl), transcribe and store transcript
      const insertItemPromises = hrQuestionItems.map(async (item) => {
        const { qno, question, marks } = item;
        let transcript = item.answer_transcript && item.answer_transcript !== "NA" ? item.answer_transcript : null;
        const maybeVideo = item.answer_url || item.video || item.videoUrl;
        const storedUrl = maybeVideo || "NA";
        if (!transcript && maybeVideo) {
          try {
            const fullUrl = makeVideoUrl(maybeVideo);
            if (fullUrl) {
              console.log(`[HR][UPLOAD] Transcribing teacher video qno=${qno} -> ${fullUrl} (AI: ${AI_SERVER_URL})`);
              const t = await transcribe(fullUrl);
              transcript = t.transcript || "NA";
            }
          } catch (e) {
            console.warn(`[HR][UPLOAD] Transcribe failed qno=${qno}:`, e.message);
            transcript = "NA";
          }
        }
        if (!transcript) transcript = "NA";

        return new Promise((resolve, reject) => {
          connection.query(
            queryInsertItem,
            [hr_question_id, qno, question, marks, storedUrl, transcript],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });
      });

      // Wait for all inserts to finish
      Promise.all(insertItemPromises)
        .then(() => {
          res.status(201).json({
            message: "questions uploaded successfully",
            id: hr_question_id,
          });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { hrQuestion, hrQuestionItems } = req.body;
  const { title, description, due_date, totalMarks } = hrQuestion;

  const queryUpdatetHR = `
    UPDATE hr_questions set title = ?, description = ?, upload_date = ?, due_date = ?, total_marks = ? where user_id = ? and id=?`;

  connection.query(
    queryUpdatetHR,
    [title, description, new Date(), due_date, totalMarks, req.user.id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const queryUpdateItem = `
        UPDATE hr_question_items SET question = ?, marks = ?, answer_url = ?, answer_transcript = ? WHERE hr_question_id = ? AND qno = ?
      `;

      const makeVideoUrl = (val) => {
        if (!val) return null;
        if (/^https?:\/\//i.test(val)) return val;
        const base = process.env.BACKEND_PUBLIC_BASE || "http://localhost:5000";
        return `${base}/videos/${val}`;
      };

      // Update items; if transcript missing but a video reference provided, transcribe it now
      const insertItemPromises = hrQuestionItems.map(async (item) => {
        const { qno, question, marks } = item;
        let transcript = item.answer_transcript && item.answer_transcript !== "NA" ? item.answer_transcript : null;
        const maybeVideo = item.answer_url || item.video || item.videoUrl;
        const storedUrl = maybeVideo || "NA";
        if (!transcript && maybeVideo) {
          try {
            const fullUrl = makeVideoUrl(maybeVideo);
            if (fullUrl) {
              console.log(`[HR][UPDATE] Transcribing teacher video qno=${qno} -> ${fullUrl} (AI: ${AI_SERVER_URL})`);
              const t = await transcribe(fullUrl);
              transcript = t.transcript || "NA";
            }
          } catch (e) {
            console.warn(`[HR][UPDATE] Transcribe failed qno=${qno}:`, e.message);
            transcript = "NA";
          }
        }
        if (!transcript) transcript = "NA";

        return new Promise((resolve, reject) => {
          connection.query(queryUpdateItem, [question, marks, storedUrl, transcript, id, qno], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      });

      // Wait for all inserts to finish
      Promise.all(insertItemPromises)
        .then(() => {
          res.status(201).json({
            message: "questions updated successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM hr_questions WHERE id = ? and user_id=? ", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    else if (result.affectedRows == 0)
      return res.status(404).json({
        message: "HR post not found",
      });
    res.status(201).json({
      message: "HR post deleted successfully",
    });
  });
});

router.delete("/:id/:qno", (req, res) => {
  const id = req.params.id;
  const qno = req.params.qno;

  connection.query("select user_id from hr_questions where id = ?", [id], (err, result) => {
    console.log(result);

    if (result.length == 0) {
      res.status(404).json({
        message: "Post not found",
      });
    } else if (result[0].user_id == req.user.id) {
      connection.query("DELETE FROM hr_question_items WHERE hr_question_id = ? and qno=?", [id, qno], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        else if (result.affectedRows == 0)
          return res.status(404).json({
            message: "question not found",
          });
        res.status(201).json({
          message: "Question deleted successfully",
        });
      });
    } else {
      res.status(401).json({
        message: "deletion not permitted for this users",
      });
    }
  });
});
//answer routes here

router.post("/answers", (req, res) => {
  const { hr_question_id, answers } = req.body;

  const query = `
      INSERT INTO hr_answers (hr_question_id, user_id, qno, answer) VALUES (?, ?, ?, ?)
    `;
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
        id: hr_question_id,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// routes/hr.js
router.get("/answers/:id", (req, res) => {
  const id = req.params.id;

  // Step 1: Get unique user IDs who answered the question
  connection.query("SELECT user_id FROM hr_answers WHERE hr_question_id = ? GROUP BY user_id", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "No answers yet" });

    const userIds = results.map((row) => row.user_id);

    // Step 2: Fetch user details for those IDs
    const query = `SELECT id, name, email_id FROM user WHERE id IN (?)`;
    connection.query(query, [userIds], (err2, userDetails) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({ users: userDetails });
    });
  });
});

router.get("/answers/:id/:user_id", (req, res) => {
  const id = req.params.id;
  const user_id = req.params.user_id;
  connection.query(
    "SELECT * FROM hr_answers WHERE hr_question_id = ? AND user_id = ?",
    [id, user_id],
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
  const query = `UPDATE hr_questions SET display_result=? WHERE id=?`;
  connection.query(query, [display_result, id], (err, result) => {
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
    SELECT DISTINCT hr_question_id 
    FROM hr_answers 
    WHERE user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const attemptedIds = results.map((row) => row.hr_question_id);
    res.json({ attempted: attemptedIds });
  });
});

// Update marks for a specific user's answers
router.put("/answers/:hr_question_id/:user_id/marks", (req, res) => {
  const { hr_question_id, user_id } = req.params;
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: "updates array is required" });
  }

  const updatePromises = updates.map(({ qno, marks_awarded }) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE hr_answers SET marks_awarded = ? WHERE hr_question_id = ? AND user_id = ? AND qno = ?`;
      connection.query(query, [marks_awarded, hr_question_id, user_id, qno], (err, result) => {
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
