const connection = require("../db");
const { transcribe, score, AI_SERVER_URL } = require("./aiClient");

// Helpers
function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function evaluateHrSet(hr_question_id, user_id) {
  // Fetch HR answers for a specific set and user, tolerate 0-based qno by mapping 0->1
  const answers = await query(
    "SELECT a.qno, a.answer, q.question, q.marks, q.answer_transcript FROM hr_answers a JOIN hr_question_items q ON q.hr_question_id = a.hr_question_id AND q.qno = CASE WHEN a.qno=0 THEN 1 ELSE a.qno END WHERE a.hr_question_id = ? AND a.user_id = ?",
    [hr_question_id, user_id]
  );

  if (!answers.length) {
    throw new Error("No answers found");
  }
  const results = [];
  for (const row of answers) {
    try {
      // We treat question text as expected transcript and student's answer may be a filename (video) or text
      let studentText = row.answer;
      console.log(`[HR] Evaluating qno=${row.qno} user=${user_id} set=${hr_question_id}`);
      console.log(`[HR] Raw answer:`, studentText);
      if (/^https?:\/\//i.test(studentText)) {
        // Direct URL
        console.log(`[HR] Transcribe via URL -> ${studentText} (AI: ${AI_SERVER_URL})`);
        const t = await transcribe(studentText);
        studentText = t.transcript || "";
      } else if (/\.mp4$|\.webm$|\.ogg$|\.mkv$/i.test(studentText)) {
        // It's a filename stored via /api/videos, construct a URL served from backend static
        const videoUrl = `${process.env.BACKEND_PUBLIC_BASE || "http://localhost:5000"}/videos/${studentText}`;
        console.log(`[HR] Transcribe via filename -> ${videoUrl} (AI: ${AI_SERVER_URL})`);
        const t = await transcribe(videoUrl);
        studentText = t.transcript || "";
      }
      console.log(`[HR] Transcript length: ${studentText?.length || 0}`);
      const expected = row.answer_transcript && row.answer_transcript !== "NA" ? row.answer_transcript : row.question;
      const s = await score(expected, studentText);
      // Scale AI score(0..100) to question marks
      const percent = clamp(s.score || 0, 0, 100) / 100;
      const marks_awarded = Math.round(percent * (row.marks || 0));

      await query("UPDATE hr_answers SET marks_awarded=? WHERE hr_question_id=? AND user_id=? AND qno=?", [
        marks_awarded,
        hr_question_id,
        user_id,
        row.qno,
      ]);
      console.log(`[HR] qno=${row.qno} -> score=${s.score} marks_awarded=${marks_awarded}`);
      results.push({ qno: row.qno, marks_awarded, score: s.score });
    } catch (e) {
      console.error(`[HR] Evaluation error qno=${row.qno} user=${user_id} set=${hr_question_id}:`, e.message);
      results.push({ qno: row.qno, error: e.message });
    }
  }

  return { count: results.length, results };
}

async function evaluateTechnicalSet(technical_id, user_id) {
  const answers = await query(
    "SELECT a.qno, a.answer, q.question, q.marks, q.answer_transcript FROM technical_answers a JOIN technical_question_items q ON q.technical_id = a.technical_id AND q.qno = CASE WHEN a.qno=0 THEN 1 ELSE a.qno END WHERE a.technical_id = ? AND a.user_id = ?",
    [technical_id, user_id]
  );

  if (!answers.length) {
    throw new Error("No answers found");
  }
  const results = [];
  for (const row of answers) {
    try {
      let studentText = row.answer;
      console.log(`[TECH] Evaluating qno=${row.qno} user=${user_id} set=${technical_id}`);
      console.log(`[TECH] Raw answer:`, studentText);
      if (/^https?:\/\//i.test(studentText)) {
        console.log(`[TECH] Transcribe via URL -> ${studentText} (AI: ${AI_SERVER_URL})`);
        const t = await transcribe(studentText);
        studentText = t.transcript || "";
      } else if (/\.mp4$|\.webm$|\.ogg$|\.mkv$/i.test(studentText)) {
        const videoUrl = `${process.env.BACKEND_PUBLIC_BASE || "http://localhost:5000"}/videos/${studentText}`;
        console.log(`[TECH] Transcribe via filename -> ${videoUrl} (AI: ${AI_SERVER_URL})`);
        const t = await transcribe(videoUrl);
        studentText = t.transcript || "";
      }
      console.log(`[TECH] Transcript length: ${studentText?.length || 0}`);
      const expected = row.answer_transcript && row.answer_transcript !== "NA" ? row.answer_transcript : row.question;
      const s = await score(expected, studentText);
      const percent = clamp(s.score || 0, 0, 100) / 100;
      const marks_awarded = Math.round(percent * (row.marks || 0));

      await query("UPDATE technical_answers SET marks_awarded=? WHERE technical_id=? AND user_id=? AND qno=?", [
        marks_awarded,
        technical_id,
        user_id,
        row.qno,
      ]);
      console.log(`[TECH] qno=${row.qno} -> score=${s.score} marks_awarded=${marks_awarded}`);
      results.push({ qno: row.qno, marks_awarded, score: s.score });
    } catch (e) {
      console.error(`[TECH] Evaluation error qno=${row.qno} user=${user_id} set=${technical_id}:`, e.message);
      results.push({ qno: row.qno, error: e.message });
    }
  }

  return { count: results.length, results };
}

module.exports = {
  evaluateHrSet,
  evaluateTechnicalSet,
};
