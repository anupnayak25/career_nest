# Troubleshooting Guide

Common issues and solutions for Career Nest platform.

## 📋 Table of Contents

- [Backend Issues](#backend-issues)
- [Database Issues](#database-issues)
- [AI Server Issues](#ai-server-issues)
- [Website Issues](#website-issues)
- [Flutter App Issues](#flutter-app-issues)
- [Network and Connectivity](#network-and-connectivity)
- [Build and Deployment](#build-and-deployment)
- [Performance Issues](#performance-issues)
- [Getting Help](#getting-help)

---

## 🔧 Backend Issues

### Issue: Server Won't Start

**Error**: `Port 5000 is already in use`

**Solution 1**: Kill the process using port 5000
```bash
# Linux/macOS
lsof -ti:5000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Solution 2**: Change the port in `.env`
```env
PORT=5001
```

---

### Issue: Module Not Found

**Error**: `Error: Cannot find module 'express'`

**Solution**: Reinstall dependencies
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: JWT Token Invalid

**Error**: `401 Unauthorized - Invalid token`

**Possible Causes**:
1. Token expired (24-hour validity)
2. JWT_SECRET changed on server
3. Token malformed

**Solution**:
1. Login again to get a new token
2. Check JWT_SECRET in `.env` hasn't changed
3. Verify token is being sent correctly in Authorization header

---

### Issue: CORS Errors

**Error**: `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**: Update CORS configuration in `backend/server.js`
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

---

### Issue: File Upload Fails

**Error**: `Error: File too large` or `No file uploaded`

**Solutions**:

1. **Check file size limit** in `backend/server.js`:
```javascript
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});
```

2. **Check disk space**:
```bash
df -h
```

3. **Verify videos directory exists**:
```bash
mkdir -p backend/videos
chmod 755 backend/videos
```

---

## 💾 Database Issues

### Issue: Cannot Connect to Database

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions**:

1. **Check if MySQL is running**:
```bash
# Linux
sudo systemctl status mysql

# macOS
brew services list | grep mysql

# Windows
net start | findstr MySQL
```

2. **Start MySQL if not running**:
```bash
# Linux
sudo systemctl start mysql

# macOS
brew services start mysql

# Windows
net start MySQL80
```

3. **Verify credentials in `.env`**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrer_nest
```

4. **Test connection manually**:
```bash
mysql -h localhost -u root -p
```

---

### Issue: Table Doesn't Exist

**Error**: `Table 'carrer_nest.users' doesn't exist`

**Solution**: Import the database schema
```bash
cd backend
mysql -u root -p carrer_nest < carrer_nest.sql
```

---

### Issue: Access Denied for User

**Error**: `Access denied for user 'root'@'localhost'`

**Solutions**:

1. **Reset MySQL password**:
```bash
# Linux/macOS
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

2. **Create new user**:
```sql
CREATE USER 'carrer_nest'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON carrer_nest.* TO 'carrer_nest'@'localhost';
FLUSH PRIVILEGES;
```

---

### Issue: SSL Connection Error

**Error**: `Error: SSL connection error`

**Solution 1**: Disable SSL in development
```env
SSL_MODE=DISABLED
```

**Solution 2**: Provide SSL certificate
```env
SSL_MODE=REQUIRED
SSL_CERT=/path/to/ca-certificate.crt
```

---

## 🤖 AI Server Issues

### Issue: AI Server Won't Start

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**: Activate virtual environment and install dependencies
```bash
cd ai_server
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

---

### Issue: FFmpeg Not Found

**Error**: `ffmpeg: command not found`

**Solutions**:

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS**:
```bash
brew install ffmpeg
```

**Windows**:
1. Download from https://ffmpeg.org/download.html
2. Add to system PATH

**Verify installation**:
```bash
ffmpeg -version
```

---

### Issue: Model Download Fails

**Error**: `Error downloading Whisper model`

**Solutions**:

1. **Check internet connection**

2. **Manually download model**:
```python
import whisper
model = whisper.load_model("base", download_root="./models")
```

3. **Use smaller model**:
```python
model = whisper.load_model("tiny")  # Instead of "base"
```

---

### Issue: Video Transcription Timeout

**Error**: `Request timeout` or slow transcription

**Solutions**:

1. **Increase timeout** in backend:
```javascript
const response = await axios.post(AI_SERVER_URL + '/transcribe', data, {
  timeout: 300000 // 5 minutes
});
```

2. **Use smaller Whisper model** (faster but less accurate)

3. **Reduce video file size before upload**

---

### Issue: Out of Memory

**Error**: `MemoryError` or `Killed`

**Solutions**:

1. **Increase server memory**

2. **Process videos in chunks**

3. **Use smaller model**:
```python
model = whisper.load_model("tiny")
```

4. **Limit concurrent requests**:
```python
from flask_limiter import Limiter
limiter = Limiter(app, default_limits=["5 per minute"])
```

---

## 🌐 Website Issues

### Issue: Blank Page / White Screen

**Solutions**:

1. **Check browser console** (F12) for errors

2. **Verify API URL** in `.env`:
```env
VITE_API_URL=http://localhost:5000
```

3. **Clear browser cache** (Ctrl+Shift+R)

4. **Rebuild the project**:
```bash
npm run build
npm run dev
```

---

### Issue: API Calls Failing

**Error**: `Network Error` or `Failed to fetch`

**Solutions**:

1. **Check if backend is running**:
```bash
curl http://localhost:5000
```

2. **Verify CORS settings** in backend

3. **Check browser console** for exact error

4. **Verify API URL** in code and `.env`

---

### Issue: Hot Reload Not Working

**Solutions**:

1. **Restart dev server**:
```bash
# Press Ctrl+C
npm run dev
```

2. **Clear node_modules**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

3. **Check for file system watchers limit** (Linux):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Issue: Build Fails

**Error**: `Build failed with X errors`

**Solutions**:

1. **Check for syntax errors** in code

2. **Clear cache**:
```bash
rm -rf node_modules .vite dist
npm install
npm run build
```

3. **Update dependencies**:
```bash
npm update
```

---

## 📱 Flutter App Issues

### Issue: App Won't Build

**Error**: `Gradle build failed`

**Solutions**:

1. **Clean and rebuild**:
```bash
flutter clean
flutter pub get
flutter run
```

2. **Update Gradle** (Android):
```bash
cd android
./gradlew clean
cd ..
```

3. **Check Java version**:
```bash
java -version
# Should be Java 11 or higher
```

---

### Issue: Cannot Connect to API

**Error**: `SocketException: Failed to connect`

**Solutions**:

**Android Emulator**:
```dart
static const String baseUrl = 'http://10.0.2.2:5000';
```

**iOS Simulator**:
```dart
static const String baseUrl = 'http://localhost:5000';
```

**Physical Device**:
```dart
// Use your computer's IP address
static const String baseUrl = 'http://192.168.1.10:5000';
```

**Find your IP**:
```bash
# Linux/macOS
ifconfig | grep inet

# Windows
ipconfig
```

---

### Issue: Camera Permission Denied

**Solutions**:

1. **Check AndroidManifest.xml**:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

2. **Check Info.plist** (iOS):
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access required for video interviews</string>
```

3. **Request permissions at runtime**:
```dart
import 'package:permission_handler/permission_handler.dart';

await Permission.camera.request();
await Permission.microphone.request();
```

---

### Issue: Hot Reload Not Working

**Solutions**:

1. **Use Hot Restart** instead: Press `R` (capital R)

2. **Restart app completely**:
```bash
flutter run
```

3. **Check for stateful widget issues**

---

## 🌐 Network and Connectivity

### Issue: Port Already in Use

**Solutions**: See [Backend Issues - Server Won't Start](#issue-server-wont-start)

---

### Issue: Slow API Responses

**Diagnostics**:

1. **Check network latency**:
```bash
ping localhost
```

2. **Check database performance**:
```sql
SHOW PROCESSLIST;
```

3. **Enable query logging** to find slow queries

**Solutions**:

1. **Add database indexes**
2. **Optimize queries**
3. **Implement caching** (Redis)
4. **Use connection pooling**

---

### Issue: Video Upload Slow

**Solutions**:

1. **Compress videos** before upload

2. **Increase upload timeout**

3. **Use chunked upload** for large files

4. **Check internet speed**

---

## 🚀 Build and Deployment

### Issue: Production Build Fails

**Backend**:
```bash
# Check for missing dependencies
npm install --production

# Set NODE_ENV
export NODE_ENV=production
node server.js
```

**Website**:
```bash
# Check environment variables
cat .env

# Build
npm run build

# Check output
ls -la dist/
```

---

### Issue: Environment Variables Not Working

**Solutions**:

1. **Verify .env file exists**:
```bash
ls -la .env
```

2. **Check syntax** (no spaces around =):
```env
# Wrong
PORT = 5000

# Correct
PORT=5000
```

3. **Restart server** after changing .env

4. **For Vite, prefix with VITE_**:
```env
VITE_API_URL=http://localhost:5000
```

---

### Issue: PM2 Not Starting

**Solutions**:

1. **Check logs**:
```bash
pm2 logs
```

2. **Restart with updated code**:
```bash
pm2 restart all
pm2 save
```

3. **Delete and recreate**:
```bash
pm2 delete all
pm2 start server.js --name career-nest
pm2 save
```

---

## ⚡ Performance Issues

### Issue: High Memory Usage

**Solutions**:

1. **Check for memory leaks** using Node.js profiler

2. **Limit connection pool size**:
```javascript
const pool = mysql.createPool({
  connectionLimit: 10
});
```

3. **Implement pagination** for large queries

4. **Clear unused variables**

---

### Issue: Slow Database Queries

**Solutions**:

1. **Add indexes**:
```sql
CREATE INDEX idx_user_id ON hr_answers(user_id);
CREATE INDEX idx_question_id ON hr_answers(hr_question_id);
```

2. **Analyze slow queries**:
```sql
SHOW FULL PROCESSLIST;
```

3. **Use EXPLAIN** to optimize:
```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 📊 Logging and Debugging

### Enable Debug Logging

**Backend**:
```javascript
// In server.js
console.log('Request:', req.method, req.url, req.body);
```

**Check Logs**:
```bash
# PM2 logs
pm2 logs

# Direct logs
tail -f logs/combined.log
tail -f logs/error.log
```

---

## 🆘 Getting Help

If your issue isn't covered here:

### 1. Check Existing Documentation
- [Main README](README.md)
- [Setup Guide](SETUP.md)
- [Backend README](backend/README.md)
- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)

### 2. Search GitHub Issues
- Check [existing issues](https://github.com/anupnayak25/career_nest/issues)
- Search for your error message

### 3. Create a New Issue

Include:
- **Environment**: OS, Node version, Python version
- **Error message**: Complete error with stack trace
- **Steps to reproduce**: What you did before the error
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Logs**: Relevant log excerpts
- **Screenshots**: If applicable

### 4. Enable Verbose Logging

**Node.js**:
```bash
NODE_DEBUG=* node server.js
```

**Flutter**:
```bash
flutter run -v
```

**Python**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 🔍 Diagnostic Commands

### System Health Check

```bash
# Check Node.js
node --version
npm --version

# Check Python
python --version
pip --version

# Check MySQL
mysql --version
mysql -u root -p -e "SELECT VERSION();"

# Check Flutter
flutter doctor -v

# Check ports
netstat -an | grep LISTEN | grep -E '5000|7860|5173'

# Check disk space
df -h

# Check memory
free -h  # Linux
vm_stat  # macOS
```

---

## 📝 Common Error Messages

| Error | Likely Cause | Quick Fix |
|-------|--------------|-----------|
| `ECONNREFUSED` | Service not running | Start the service |
| `EADDRINUSE` | Port already in use | Kill process or change port |
| `MODULE_NOT_FOUND` | Missing dependency | Run `npm install` |
| `CORS policy` | CORS not configured | Update CORS settings |
| `401 Unauthorized` | Invalid/expired token | Login again |
| `404 Not Found` | Wrong endpoint/route | Check URL |
| `500 Internal Server Error` | Server-side error | Check logs |
| `MemoryError` | Out of memory | Increase memory/optimize |

---

**Remember**: When troubleshooting, always check logs first! Most errors are clearly described in the error messages and logs.
