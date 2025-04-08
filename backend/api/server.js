const express = require("express");
//const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB database.");
// });

// // Define your schema/models here or in separate files
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });
// const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/users", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const newUser = new User({ name, email });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Additional routes
app.use('/api/videos', require('../routes/videoRoutes'));
app.use('/api/technical', require('../routes/technicalRoutes'));
app.use('/api/quiz', require('../routes/quizRoutes'));
app.use('/api/programming', require('../routes/programmingRoutes'));
app.use('/api/hr', require('../routes/hrRoutes'));

// No app.listen here!
module.exports = app;
