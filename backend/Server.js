const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/5050", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database.");
});

// Sample Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Routes

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", async (req, res) => {
    res.send("Welcome to the API!");
  });
app.get("/test", async (req, res) => {
  res.send("Welcome to the API! hello world");
}
);
app.post("/test", async (req, res) => {
    db.collection("test").insertOne(req.body, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error inserting data");
        } else {
            res.status(201).send("Data inserted successfully");
        }
    });
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

app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/technical', require('./routes/technicalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/programming', require('./routes/programmingRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
