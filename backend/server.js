require('dotenv').config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
const fetchUser = require('./middlewares/fetchUser');
const time = new Date();
const formattedDate = `${time.getDate().toString().padStart(2, '0')}/${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getFullYear().toString().slice(-2)}`;
const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;

// Public routes
app.get("/", async (req, res) => {
  res.send(`Welcome to the API!
    </br> Server Restarted At Date: ${formattedDate} Time: ${formattedTime}`);
});


// Serve static video files first
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Public routes
app.use('/api/auth', require('./routes/authenticateRoutes'));

// Apply fetchuser AFTER public routes
app.use(fetchUser);

// Protected API routes
app.use('/api/technical', require('./routes/technicalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/programming', require('./routes/programmingRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
//app.use('/api/notification',require('./routes/notificationRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
