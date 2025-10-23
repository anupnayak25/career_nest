require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');

function buildConfigFromEnv() {
  const cfg = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  };

  const url = process.env.DB_URL;
  if (url) {
    try {
      const u = new URL(url);
      cfg.host = u.hostname;
      cfg.port = Number(u.port) || (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306);
      cfg.user = decodeURIComponent(u.username);
      cfg.password = decodeURIComponent(u.password);
      // pathname like "/defaultdb"
      const dbName = u.pathname && u.pathname !== '/' ? u.pathname.slice(1) : undefined;
      cfg.database = dbName || process.env.DB_NAME;
      // ssl-mode is in query params
      const sslMode = u.searchParams.get('ssl-mode') || process.env.SSL_MODE;
      if (sslMode && sslMode.toUpperCase() === 'REQUIRED') {
        cfg.ssl = loadSslConfig();
      }
    } catch (e) {
      console.warn('[DB] Failed to parse DB_URL, falling back to discrete env vars:', e.message);
    }
  }

  // Fallback to discrete env vars if anything missing
  cfg.host = cfg.host || process.env.DB_HOST;
  cfg.port = cfg.port || (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306);
  cfg.user = cfg.user || process.env.DB_USER;
  cfg.password = cfg.password || process.env.DB_PASSWORD;
  cfg.database = cfg.database || process.env.DB_NAME;

  const sslModeEnv = process.env.SSL_MODE;
  if (!cfg.ssl && sslModeEnv && sslModeEnv.toUpperCase() === 'REQUIRED') {
    cfg.ssl = loadSslConfig();
  }

  return cfg;
}

function loadSslConfig() {
  // Prefer explicit CA content if provided
  let ca = process.env.SSL_CERT;
  if (ca && ca.includes('BEGIN CERTIFICATE')) {
    // support escaped newlines
    ca = ca.replace(/\\n/g, '\n');
    return { ca, rejectUnauthorized: true };
  }

  // Base64-encoded certificate
  const caB64 = process.env.SSL_CERT_BASE64;
  if (caB64) {
    try {
      const decoded = Buffer.from(caB64, 'base64').toString('utf8');
      return { ca: decoded, rejectUnauthorized: true };
    } catch (e) {
      console.warn('[DB] Failed to decode SSL_CERT_BASE64:', e.message);
    }
  }

  // File path
  const caFile = process.env.SSL_CA_FILE || process.env.SSL_CERT_PATH;
  if (caFile && fs.existsSync(caFile)) {
    try {
      const fileData = fs.readFileSync(caFile, 'utf8');
      return { ca: fileData, rejectUnauthorized: true };
    } catch (e) {
      console.warn('[DB] Failed to read SSL CA file:', e.message);
    }
  }

  // Fallback: try to read inline PEM block directly from backend/.env if present as raw lines
  try {
    const envPath = require('path').join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envText = fs.readFileSync(envPath, 'utf8');
      const match = envText.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
      if (match) {
        return { ca: match[0], rejectUnauthorized: true };
      }
    }
  } catch (e) {
    console.warn('[DB] Fallback read of inline PEM from .env failed:', e.message);
  }

  // As a last resort, allow SSL without CA (not recommended)
  console.warn('[DB] SSL_MODE=REQUIRED but no CA provided; proceeding with rejectUnauthorized=false');
  return { rejectUnauthorized: false };
}

const config = buildConfigFromEnv();
const pool = mysql.createPool(config);

module.exports = pool;