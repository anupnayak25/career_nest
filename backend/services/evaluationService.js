const connection = require('../db');
const { transcribe, score } = require('./aiClient');

// Helpers
function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

async function evaluateHrSet(hr_question_id, user_id) {
  // Fetch HR answers for a specific set and user
  const answers = await query(
    'SELECT a.qno, a.answer, q.question, q.marks FROM hr_answers a JOIN hr_question_items q ON q.hr_question_id = a.hr_question_id AND q.qno = a.qno WHERE a.hr_question_id = ? AND a.user_id = ?',
    [hr_question_id, user_id]
  );

  if (!answers.length) {
    throw new Error('No answers found');
  }
  const results = [];
  for (const row of answers) {
    try {
      // We treat question text as expected transcript and student's answer may be a filename (video) or text
      let studentText = row.answer;
      if (/^https?:\/\//i.test(studentText)) {
        // Direct URL
        const t = await transcribe(studentText);
        studentText = t.transcript || '';
      } else if (/\.mp4$|\.webm$|\.ogg$|\.mkv$/i.test(studentText)) {
        // It's a filename stored via /api/videos, construct a URL served from backend static
        const videoUrl = `${process.env.BACKEND_PUBLIC_BASE || 'http://localhost:5000'}/videos/${studentText}`;
        const t = await transcribe(videoUrl);
        studentText = t.transcript || '';
      }

      const s = await score(row.question, studentText);
      // Scale AI score(0..100) to question marks
      const percent = clamp((s.score || 0), 0, 100) / 100;
      const marks_awarded = Math.round(percent * (row.marks || 0));

      await query(
        'UPDATE hr_answers SET marks_awarded=? WHERE hr_question_id=? AND user_id=? AND qno=?',
        [marks_awarded, hr_question_id, user_id, row.qno]
      );

      results.push({ qno: row.qno, marks_awarded, score: s.score });
    } catch (e) {
      results.push({ qno: row.qno, error: e.message });
    }
  }

  return { count: results.length, results };
}

async function evaluateTechnicalSet(technical_id, user_id) {
  const answers = await query(
    'SELECT a.qno, a.answer, q.question, q.marks FROM technical_answers a JOIN technical_question_items q ON q.technical_id = a.technical_id AND q.qno = a.qno WHERE a.technical_id = ? AND a.user_id = ?',
    [technical_id, user_id]
  );

  if (!answers.length) {
    throw new Error('No answers found');
  }
  const results = [];
  for (const row of answers) {
    try {
      let studentText = row.answer;
      if (/^https?:\/\//i.test(studentText)) {
        const t = await transcribe(studentText);
        studentText = t.transcript || '';
      } else if (/\.mp4$|\.webm$|\.ogg$|\.mkv$/i.test(studentText)) {
        const videoUrl = `${process.env.BACKEND_PUBLIC_BASE || 'http://localhost:5000'}/videos/${studentText}`;
        const t = await transcribe(videoUrl);
        studentText = t.transcript || '';
      }

      const s = await score(row.question, studentText);
      const percent = clamp((s.score || 0), 0, 100) / 100;
      const marks_awarded = Math.round(percent * (row.marks || 0));

      await query(
        'UPDATE technical_answers SET marks_awarded=? WHERE technical_id=? AND user_id=? AND qno=?',
        [marks_awarded, technical_id, user_id, row.qno]
      );

      results.push({ qno: row.qno, marks_awarded, score: s.score });
    } catch (e) {
      results.push({ qno: row.qno, error: e.message });
    }
  }

  return { count: results.length, results };
}

module.exports = {
  evaluateHrSet,
  evaluateTechnicalSet,
};
