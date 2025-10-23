const express = require('express');
const router = express.Router();
const { evaluateHrSet, evaluateTechnicalSet } = require('../services/evaluationService');
const { ping, AI_SERVER_URL } = require('../services/aiClient');

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