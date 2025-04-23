const express = require("express");
const cors = require("cors");
const path = require('path');



const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.get("/", async (req, res) => {
    res.send("Welcome to the API!");
  });
// Add a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/technical', require('./routes/technicalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/programming', require('./routes/programmingRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
