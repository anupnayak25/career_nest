const express = require('express');
const router = express.Router();
const { evaluateHrSet, evaluateTechnicalSet } = require('../services/evaluationService');
const db = require('../db');

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}
const { ping, AI_SERVER_URL } = require('../services/aiClient');

async function setAnalysisStatus(type, setId, status) {
  const table = type === 'hr' ? 'hr_questions' : 'technical_questions';
  try {
    await query(`UPDATE ${table} SET analysis_status=? WHERE id=?`, [status, Number(setId)]);
  } catch (e) {
    // Column might not exist yet; log and continue without failing the request
    console.warn('analysis_status update failed:', e.message);
  }
}

// POST /api/evaluate/batch
// Body: { type: 'hr'|'technical', setId: number, userIds: number[] }
router.post('/batch', async (req, res) => {
  const { type, setId, userIds } = req.body;

  if (!type || !['hr', 'technical'].includes(type)) {
    return res.status(400).json({ error: 'type must be hr or technical' });
  }
  if (!setId) {
    return res.status(400).json({ error: 'setId is required' });
  }
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'userIds must be a non-empty array' });
  }

  const summary = [];
  for (const userId of userIds) {
    try {
      const result = type === 'hr'
        ? await evaluateHrSet(setId, userId)
        : await evaluateTechnicalSet(setId, userId);
      summary.push({ userId, ok: true, ...result });
    } catch (e) {
      summary.push({ userId, ok: false, error: e.message });
    }
  }

  res.json({ type, setId, total: summary.length, summary });
});

// POST /api/evaluate/:id
// Body: { type: 'hr'|'technical', userId?: number }
// If userId provided, evaluates only that user's answers for the given set/question id.
// Otherwise, evaluates all users who have submitted answers for that set/question id.
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, userId } = req.body || {};

  if (!type || !['hr', 'technical'].includes(type)) {
    return res.status(400).json({ success: false, message: 'type must be hr or technical' });
  }
  if (!id) {
    return res.status(400).json({ success: false, message: 'id is required' });
  }

  try {
    await setAnalysisStatus(type, id, 'undergoing');
    let userIds = [];
    if (userId) {
      userIds = [Number(userId)];
    } else {
      if (type === 'hr') {
        const rows = await query('SELECT DISTINCT user_id FROM hr_answers WHERE hr_question_id = ?', [id]);
        userIds = rows.map(r => r.user_id);
      } else {
        const rows = await query('SELECT DISTINCT user_id FROM technical_answers WHERE technical_id = ?', [id]);
        userIds = rows.map(r => r.user_id);
      }
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      await setAnalysisStatus(type, id, 'completed');
      return res.json({ success: true, type, setId: Number(id), total: 0, summary: [] });
    }

    const summary = [];
    for (const uid of userIds) {
      try {
        const result = type === 'hr'
          ? await evaluateHrSet(Number(id), uid)
          : await evaluateTechnicalSet(Number(id), uid);
        summary.push({ userId: uid, ok: true, ...result });
      } catch (e) {
        summary.push({ userId: uid, ok: false, error: e.message });
      }
    }

    await setAnalysisStatus(type, id, 'completed');
    return res.json({ success: true, type, setId: Number(id), total: summary.length, summary });
  } catch (e) {
    console.error('Evaluate route error:', e);
    await setAnalysisStatus(type, id, 'not_analysed');
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/evaluate/:id/status?type=hr|technical
router.get('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  if (!type || !['hr', 'technical'].includes(type)) {
    return res.status(400).json({ success: false, message: 'type must be hr or technical' });
  }
  const table = type === 'hr' ? 'hr_questions' : 'technical_questions';
  try {
    const rows = await query(`SELECT analysis_status FROM ${table} WHERE id = ?`, [Number(id)]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'set not found' });
    }
    const status = rows[0].analysis_status || 'not_analysed';
    return res.json({ success: true, status });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/evaluate/health
router.get('/health', async (req, res) => {
  try {
    const data = await ping();
    res.json({ ok: true, aiServer: AI_SERVER_URL, data });
  } catch (e) {
    res.status(500).json({ ok: false, aiServer: AI_SERVER_URL, error: e.message });
  }
});

module.exports = router;