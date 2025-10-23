#!/usr/bin/env node
/*
Usage:
  node scripts/run-evaluation.js hr <setId> <userId>
  node scripts/run-evaluation.js technical <setId> <userId>
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { evaluateHrSet, evaluateTechnicalSet } = require('../services/evaluationService');

async function main() {
  const [type, setIdStr, userIdStr] = process.argv.slice(2);
  const setId = Number(setIdStr);
  const userId = Number(userIdStr);
  if (!type || !['hr', 'technical'].includes(type) || !setId || !userId) {
    console.error('Usage: node scripts/run-evaluation.js <hr|technical> <setId> <userId>');
    process.exit(1);
  }
  try {
    const result = type === 'hr'
      ? await evaluateHrSet(setId, userId)
      : await evaluateTechnicalSet(setId, userId);
    console.log(JSON.stringify({ type, setId, userId, ...result }, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(2);
  }
}

main();
