const fs = require('fs');
const path = require('path');

// Ensure the logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a write stream
const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });
// Override console methods
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  const message = `[LOG ${new Date().toISOString()}] ${args.join(' ')}\n`;
  logFile.write(message);
  originalLog(...args); // still show in terminal
};

console.error = (...args) => {
  const message = `[ERROR ${new Date().toISOString()}] ${args.join(' ')}\n`;
  logFile.write(message);
  originalError(...args); // still show in terminal
};
