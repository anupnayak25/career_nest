// Example Express handler to call Flask /transcribe
// filepath: c:\Users\Anup Nayak\Desktop\career_nest\backend\routes\evaluateRoutes.js

const express = require("express");
const axios = require("axios");
const connection = require("../db");
const router = express.Router();

// POST /api/evaluate/transcribe
router.post("/transcribe", async (req, res) => {
  const { question_id, type } = req.body;
  let tableName = "";
  if (type === "hr") {
    tableName = "hr_question_items";
  } else if (type === "technical") {
    tableName = "technical_question_items";
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }
  connection.query(
    "SELECT id,answer_url FROM ?? WHERE id = ? and answer_url != 'NA'",
    [tableName, question_id],
    async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "DB error" });
      }
      if (!results.length) {
        console.error("No video_url found for id", question_id);
        return res.status(404).json({ error: "No video_url found" });
      }
      const videoUrl = results[0].answer_url;
      // 2. Call Flask /transcribe endpoint
      try {
        const response = await axios.post("https://lh3bvwkx-7860.inc1.devtunnels.ms/", {
          videoUrl: videoUrl,
        });
        const transcript = response.data.transcript;
        // You can now use the transcript (e.g., save to DB, log, etc.)
        console.log("Transcript:", transcript);
        return res.json({ transcript });
      } catch (error) {
        console.error("Error calling AI server:", error.message);
        return res.status(500).json({ error: "AI server error" });
      }
    }
  );
});

// You can add more routes here as needed

module.exports = router;
