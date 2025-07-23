// server.js

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require('./logger'); // optional: for log creation

const connection = require("./db");
const fetchUser = require("./middlewares/fetchUser");

const app = express();
const PORT = process.env.PORT || 5000;

// ======= Global Safety Handlers =======
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[FATAL] Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// ======= Middleware Setup =======
app.use(cors({
  origin: true, // Allow all origins during development
  credentials: true
}));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.headers.origin || 'unknown origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded video files
const videosPath = path.join(__dirname, "videos");
if (!fs.existsSync(videosPath)) {
  fs.mkdirSync(videosPath, { recursive: true });
}
app.use("/videos", express.static(videosPath));
// ======= Welcome Route =======
const getTimeStamp = () => {
  const time = new Date();
  const formattedDate = `${time.getDate().toString().padStart(2, "0")}/${(time.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${time.getFullYear().toString().slice(-2)}`;
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes()
    .toString()
    .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;
  return { formattedDate, formattedTime };
};

app.get("/", (req, res) => {
  const { formattedDate, formattedTime } = getTimeStamp();
  res.send(
    `🚀 Welcome to the API!<br/>🕒 Server Restarted At Date: ${formattedDate} Time: ${formattedTime}`
  );
});

// ======= Direct Query Test (DEV Only) =======
app.post("/run-query", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ results });
  });
});

// ======= Public Routes =======
app.use("/api/auth", require("./routes/authenticateRoutes"));

app.get("/api/logs", (req, res) => {
  const logFilePath = path.join(__dirname, "logs", "app.log");
  if (!fs.existsSync(logFilePath)) return res.status(404).send("Log file not found.");
  res.sendFile(logFilePath);
});

// ======= Protected Routes (require fetchUser middleware) =======
app.use(fetchUser); // protect all below

app.use("/api/technical", require("./routes/technicalRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/programming", require("./routes/programmingRoutes"));
app.use("/api/hr", require("./routes/hrRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/videos", require("./routes/videoRoutes")); // ✅ Video API route

// ======= Start Server =======
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
