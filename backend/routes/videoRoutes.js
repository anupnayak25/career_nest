// routes/videoRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connection = require('../db'); // MySQL connection

// Ensure 'videos' folder exists
const videosDir = path.join(__dirname, '..', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
  console.log(`[✔] Created 'videos' directory at ${videosDir}`);
}

// Multer configuration for video upload
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

// @route   POST /api/videos/upload
// @desc    Upload single video file (no DB yet)
// @access  Protected
router.post('/upload', (req, res) => {
  upload.single('video')(req, res, err => {
    if (err) {
      console.error("UPLOAD ERROR:", err.message);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded.' 
      });
    }

    const fileUrl = req.file.filename; // Just return filename
    console.log(`[✔] Video uploaded: ${req.file.filename}`);
    
    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully!',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

// @route   POST /api/videos/upload-multiple
// @desc    Upload multiple video files (no DB yet)
// @access  Protected
router.post('/upload-multiple', (req, res) => {
  upload.array('videos', 10)(req, res, err => { // Allow up to 10 videos
    if (err) {
      console.error("MULTIPLE UPLOAD ERROR:", err.message);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded.' 
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: file.filename
    }));

    console.log(`[✔] ${req.files.length} videos uploaded:`, uploadedFiles.map(f => f.filename));
    
    res.status(200).json({
      success: true,
      message: `${req.files.length} videos uploaded successfully!`,
      files: uploadedFiles,
      count: req.files.length
    });
  });
});

// @route   POST /api/videos
// @desc    Save video metadata to MySQL database
// @access  Protected
router.post('/', (req, res) => {
  const { user_id, url, category, title, description } = req.body;

  // Validate required fields
  if (!user_id || !url || !category || !title) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: user_id, url, category, title' 
    });
  }

  const sql = `
    INSERT INTO videos (user_id, url, category, title, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [user_id, url, category, title, description || null];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB INSERT ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database insert error.', 
        error: err.message 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Video metadata saved successfully.',
      videoId: result.insertId
    });
  });
});

// @route   POST /api/videos/batch
// @desc    Save multiple video metadata to MySQL database
// @access  Protected
router.post('/batch', (req, res) => {
  const { videos } = req.body;

  // Validate required fields
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Videos array is required and must not be empty' 
    });
  }

  // Validate each video object
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    if (!video.user_id || !video.url || !video.category || !video.title) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields in video ${i + 1}: user_id, url, category, title` 
      });
    }
  }

  const sql = `
    INSERT INTO videos (user_id, url, category, title, description)
    VALUES ?
  `;

  const values = videos.map(video => [
    video.user_id,
    video.url,
    video.category,
    video.title,
    video.description || null
  ]);

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error("DB BATCH INSERT ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database batch insert error.', 
        error: err.message 
      });
    }

    res.status(201).json({
      success: true,
      message: `${result.affectedRows} videos saved successfully.`,
      insertedCount: result.affectedRows,
      firstVideoId: result.insertId
    });
  });
});

// @route   GET /api/videos
// @desc    Get all videos
// @access  Protected
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM videos ORDER BY publish_date DESC';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("DB FETCH ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database fetch error.', 
        error: err.message 
      });
    }

    res.json({ success: true, data: results });
  });
});

// @route   GET /api/videos/user/:userId
// @desc    Get videos by user ID
// @access  Protected
router.get('/user/:userId', (req, res) => {
  const sql = 'SELECT * FROM videos WHERE user_id = ? ORDER BY publish_date DESC';

  connection.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.error("DB FETCH ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database fetch error.', 
        error: err.message 
      });
    }

    res.json({ success: true, data: results });
  });
});

// @route   GET /api/videos/:videoId
// @desc    Get single video by ID
// @access  Protected
router.get('/:videoId', (req, res) => {
  const sql = 'SELECT * FROM videos WHERE id = ?';

  connection.query(sql, [req.params.videoId], (err, results) => {
    if (err) {
      console.error("DB FETCH ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database fetch error.', 
        error: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found.' 
      });
    }

    res.json({ success: true, data: results[0] });
  });
});

// @route   DELETE /api/videos/:videoId
// @desc    Delete video by ID (both file and database record)
// @access  Protected
router.delete('/:videoId', (req, res) => {
  const videoId = req.params.videoId;

  // First, get the video file name
  const selectSql = 'SELECT url FROM videos WHERE id = ?';

  connection.query(selectSql, [videoId], (err, results) => {
    if (err) {
      console.error("DB SELECT ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database select error.', 
        error: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found.' 
      });
    }

    const videoUrl = results[0].url; // filename
    const filepath = path.join(videosDir, videoUrl);

    // Delete the physical file
    fs.unlink(filepath, (fsErr) => {
      if (fsErr) {
        console.error("FILE DELETE ERROR:", fsErr.message);
        // Continue anyway to delete DB record
      }

      // Delete the database record
      const deleteSql = 'DELETE FROM videos WHERE id = ?';
      connection.query(deleteSql, [videoId], (delErr) => {
        if (delErr) {
          console.error("DB DELETE ERROR:", delErr.message);
          return res.status(500).json({ 
            success: false, 
            message: 'Database delete error.', 
            error: delErr.message 
          });
        }

        res.json({ 
          success: true, 
          message: 'Video deleted successfully.' 
        });
      });
    });
  });
});

// @route   PUT /api/videos/:videoId
// @desc    Update video metadata
// @access  Protected
router.put('/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const { title, description, category } = req.body;

  // Validate required fields
  if (!title || !category) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and category are required.' 
    });
  }

  const updateSql = `
    UPDATE videos
    SET title = ?, description = ?, category = ?
    WHERE id = ?
  `;

  connection.query(updateSql, [title, description || null, category, videoId], (err, result) => {
    if (err) {
      console.error("DB UPDATE ERROR:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database update error.', 
        error: err.message 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found.' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Video updated successfully.' 
    });
  });
});

module.exports = router;
