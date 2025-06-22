const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../db'); // make sure your db.js is correct

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos'); // folder where videos will be stored
  },
  filename: (req, file, cb) => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
    const ext = path.extname(file.originalname); // get original file extension
  cb(null, `${randomNumber}-${Date.now()}${ext}`);
}}
  
);

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/x-matroska', // .mkv
      'application/octet-stream' // fallback
    ];

    const extname = /\.(mp4|mov|avi|mkv)$/i.test(path.extname(file.originalname));

    if (extname && allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      console.error(`[UPLOAD] Rejected file: ${file.originalname}, MIME: ${file.mimetype}`);
      return cb(new Error('Error: Videos Only!'));
    }
  }
});

// Route to upload video
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const videoUrl = `${req.file.filename}`;
  res.status(200).json({ message: 'Video uploaded successfully', url: videoUrl });
});

router.post('/', (req, res) => {
  const { user_id, url, upload_datetime, category, title, description } = req.body;
  const query = `INSERT INTO videos (user_id, url, upload_datetime, category, title, description) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [user_id, url, upload_datetime, category, title, description], (err, result) => {
    if (err) {
      console.error("Error inserting video:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Video created successfully", videoId: result.insertId });
  });
});

// READ all videos
router.get('/', (req, res) => {
  const query = `SELECT * FROM videos`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching videos:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// READ one video by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM videos WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching video:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) return res.status(404).json({ message: "Video not found" });
    res.json(results[0]);
  });
});

// UPDATE a video by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, url, upload_datetime, category, title, description } = req.body;
  const query = `
    UPDATE videos 
    SET user_id = ?, url = ?, upload_datetime = ?, category = ?, title = ?, description = ? 
    WHERE id = ?
  `;

  db.query(query, [user_id, url, upload_datetime, category, title, description, id], (err, result) => {
    if (err) {
      console.error("Error updating video:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video updated successfully" });
  });
});

// DELETE a video by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM videos WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting video:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video deleted successfully" });
  });
});

module.exports = router;
