// Example Express handler to call Flask /transcribe
// filepath: c:\Users\Anup Nayak\Desktop\career_nest\backend\routes\evaluateRoutes.js

const axios = require('axios');
const connection = require("../db");

async function transcribe(question_id,type) {
    let tableName = "";
    if(type== "hr"){
        tableName = "hr_question_items";
    }else if(type == "technical"){
        tableName = "technical_question_items";
    }
  // 1. Get videoUrl from DB for the given hr_question_id
  connection.query(
    "SELECT id,answer_url FROM ?? WHERE id = ? and answer_url != 'NA'",
    [tableName, question_id],
    async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return;
      }
      if (!results.length) {
        console.error("No video_url found for id", hr_question_id);
        return;
      }
      const videoUrl = results[0].video_url;

      // 2. Call Flask /transcribe endpoint
      try {
        const response = await axios.post('https://lh3bvwkx-7860.inc1.devtunnels.ms/', {
          videoUrl: videoUrl
        });
        const transcript = response.data.transcript;
        // You can now use the transcript (e.g., save to DB, log, etc.)
        console.log("Transcript:", transcript);
      } catch (error) {
        console.error("Error calling AI server:", error.message);
      }
    }
  );
}

async function evaluate(question_id, type) {
  // 1. Get videoUrl from DB for the given question_id
  let tableName = "";
  if(type == "hr"){
    tableName = "hr_question_items";
  }else if(type == "technical"){
    tableName = "technical_question_items";
  }
  
  connection.query(
    "SELECT answer_url FROM ?? WHERE id = ? and answer_url != 'NA'",
    [tableName, question_id],
    async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return;
      }
      if (!results.length) {
        console.error("No video_url found for id", question_id);
        return;
      }
      const videoUrl = results[0].answer_url;                                                                                       
    
})
}

module.exports = { transcribe };