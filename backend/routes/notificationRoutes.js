const express = require('express');
const router = express.Router();
const fetchUser = require('../middlewares/fetchUser');
const db = require('../db'); // MySQL connection
const admin = require('./firebase');


app.post('/save-token', fetchUser, async (req, res) => {
  const userId = req.user.id;
  const { fcmToken } = req.body;

  try {
    await db.execute(
      'UPDATE users SET fcm_token = ? WHERE id = ?',
      [fcmToken, userId]
    );
    res.status(200).json({ message: 'Token saved' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    // Get user's FCM token from MySQL
    const [rows] = await db.execute(
      'SELECT fcm_token FROM users WHERE id = ?',
      [userId]
    );

    const fcmToken = rows[0]?.fcm_token;
    if (!fcmToken) {
      return res.status(400).json({ error: 'User has no FCM token' });
    }

    // Compose and send the message
    const message = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
