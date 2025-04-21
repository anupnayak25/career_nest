const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos'); // folder where videos will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // limit 100MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Videos Only!');
    }
  }
});

// Route to upload video
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const videoUrl = `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`;
  res.status(200).json({ message: 'Video uploaded successfully', url: videoUrl });
});

module.exports = router;
