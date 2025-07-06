const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../db'); // Your MySQL connection module

// Ensure 'videos' folder exists
const videosDir = path.join(__dirname, '..', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
  console.log(`[✔] Created 'videos' directory at ${videosDir}`);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videosDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `video-${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/x-matroska'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only video files are allowed!'));
  }
});

// 1. Upload video file only (no DB yet)
router.post('/upload', (req, res) => {
  upload.single('video')(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const fileUrl = `/videos/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully!',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

// 2. Save video metadata (no 'id' in insert)
router.post('/', (req, res) => {
  const { user_id, url, category, title, description } = req.body;

  // Basic validation
  if (!user_id || !url || !category || !title) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const upload_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    INSERT INTO videos (user_id, url, upload_datetime, category, title, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [user_id, url, upload_datetime, category, title, description || null];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB INSERT ERROR:", err.message);
      return res.status(500).json({ success: false, message: 'DB insert error.', error: err.message });
    }

    res.status(201).json({
      success: true,
      message: 'Metadata saved.',
      videoId: result.insertId
    });
  });
});

// 3. Fetch videos by user
router.get('/user/:userId', (req, res) => {
  const sql = 'SELECT * FROM videos WHERE user_id = ? ORDER BY upload_datetime DESC';

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.error("DB FETCH ERROR:", err.message);
      return res.status(500).json({ success: false, message: 'DB fetch error.', error: err.message });
    }

    res.json({ success: true, data: results });
  });
});

module.exports = router;
