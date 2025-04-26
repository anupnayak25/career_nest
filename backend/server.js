require('dotenv').config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
const fetchuser = require('./middlewares/fetchUser');

// Public routes
app.get("/", async (req, res) => {
  res.send("Welcome to the API!");
});

// Public Auth route
app.use('/api/auth', require('./routes/authenticateRoutes'));

// Apply fetchuser AFTER public routes
app.use(fetchuser);

// Protected routes
app.use('/api/technical', require('./routes/technicalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/programming', require('./routes/programmingRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
