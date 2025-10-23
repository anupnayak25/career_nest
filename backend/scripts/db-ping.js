#!/usr/bin/env node
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../db');

pool.query('SELECT 1 + 1 AS two', (err, results) => {
  if (err) {
    console.error('[DB PING] Error:', err.message);
    process.exit(1);
  }
  console.log('[DB PING] OK:', results && results[0]);
  pool.query('SELECT VERSION() as version', (err2, res2) => {
    if (err2) {
      console.error('[DB VERSION] Error:', err2.message);
      process.exit(2);
    }
    console.log('[DB VERSION] ->', res2 && res2[0]);
    process.exit(0);
  });
});
