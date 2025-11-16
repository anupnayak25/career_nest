# Environment Setup Guide

This guide will help you set up your development environment for the Career Nest project.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Operating System Specific Setup](#operating-system-specific-setup)
- [Backend Setup](#backend-setup)
- [AI Server Setup](#ai-server-setup)
- [Website Setup](#website-setup)
- [Flutter Mobile App Setup](#flutter-mobile-app-setup)
- [Database Setup](#database-setup)
- [Common Issues](#common-issues)
- [Verification](#verification)

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | v18.0.0 | https://nodejs.org/ |
| Python | 3.8 | https://www.python.org/ |
| MySQL | 8.0 | https://dev.mysql.com/downloads/ |
| Git | Latest | https://git-scm.com/ |
| FFmpeg | Latest | https://ffmpeg.org/ |

### Optional (for Mobile Development)

| Software | Purpose |
|----------|---------|
| Flutter SDK | Mobile app development |
| Android Studio | Android development |
| Xcode (macOS only) | iOS development |

## 🖥️ Operating System Specific Setup

### Windows

#### 1. Install Node.js
```powershell
# Download and run installer from nodejs.org
# Or use Chocolatey
choco install nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install Python
```powershell
# Download and run installer from python.org
# Or use Chocolatey
choco install python

# Verify installation
python --version
pip --version
```

#### 3. Install MySQL
```powershell
# Download installer from mysql.com
# Or use Chocolatey
choco install mysql

# Start MySQL service
net start MySQL80
```

#### 4. Install FFmpeg
```powershell
# Download from ffmpeg.org
# Or use Chocolatey
choco install ffmpeg

# Verify installation
ffmpeg -version
```

### macOS

#### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js
```bash
brew install node

# Verify installation
node --version
npm --version
```

#### 3. Install Python
```bash
brew install python@3.11

# Verify installation
python3 --version
pip3 --version
```

#### 4. Install MySQL
```bash
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

#### 5. Install FFmpeg
```bash
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### Linux (Ubuntu/Debian)

#### 1. Update Package Index
```bash
sudo apt update
```

#### 2. Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Install Python
```bash
sudo apt install -y python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

#### 4. Install MySQL
```bash
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

#### 5. Install FFmpeg
```bash
sudo apt install -y ffmpeg

# Verify installation
ffmpeg -version
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Create .env file
touch .env

# Or use this command (Linux/macOS)
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrer_nest
JWT_SECRET=your_jwt_secret_key_min_32_characters_long
AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000
EOF
```

For Windows (PowerShell):
```powershell
@"
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrer_nest
JWT_SECRET=your_jwt_secret_key_min_32_characters_long
AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding UTF8
```

### 4. Generate JWT Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and use it as JWT_SECRET
```

### 5. Create Videos Directory
```bash
mkdir -p videos
```

## 🤖 AI Server Setup

### 1. Navigate to AI Server Directory
```bash
cd ai_server
```

### 2. Create Virtual Environment

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```powershell
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask
- OpenAI Whisper
- Sentence Transformers
- Other required packages

**Note:** First-time installation may take several minutes as it downloads AI models.

### 4. Verify FFmpeg
```bash
ffmpeg -version
```

If FFmpeg is not installed, refer to the OS-specific setup section above.

## 🌐 Website Setup

### 1. Navigate to Website Directory
```bash
cd website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Create .env file
touch .env

# Add configuration (Linux/macOS)
echo "VITE_API_URL=http://localhost:5000" > .env
```

For Windows (PowerShell):
```powershell
"VITE_API_URL=http://localhost:5000" | Out-File -FilePath .env -Encoding UTF8
```

## 📱 Flutter Mobile App Setup

### 1. Install Flutter SDK

**Windows:**
1. Download Flutter SDK from https://flutter.dev/docs/get-started/install/windows
2. Extract to `C:\src\flutter`
3. Add `C:\src\flutter\bin` to PATH

**macOS:**
```bash
# Download Flutter
cd ~/development
git clone https://github.com/flutter/flutter.git -b stable

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="$PATH:$HOME/development/flutter/bin"

# Reload shell
source ~/.zshrc
```

**Linux:**
```bash
# Download Flutter
cd ~/development
git clone https://github.com/flutter/flutter.git -b stable

# Add to PATH (add to ~/.bashrc)
export PATH="$PATH:$HOME/development/flutter/bin"

# Reload shell
source ~/.bashrc
```

### 2. Run Flutter Doctor
```bash
flutter doctor
```

This command checks your environment and displays a report. Fix any issues it identifies.

### 3. Install Flutter Dependencies
```bash
cd app
flutter pub get
```

### 4. Setup Android Studio (for Android development)

1. Download Android Studio from https://developer.android.com/studio
2. Install Android SDK
3. Create an Android Virtual Device (AVD)

### 5. Setup Xcode (for iOS development - macOS only)

```bash
# Install Xcode from App Store
# Install command line tools
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

## 💾 Database Setup

### 1. Create Database

**Method 1: MySQL Command Line**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE carrer_nest;
USE carrer_nest;
```

**Method 2: Using Command**
```bash
mysql -u root -p -e "CREATE DATABASE carrer_nest;"
```

### 2. Import Schema
```bash
# From project root
cd backend
mysql -u root -p carrer_nest < carrer_nest.sql
```

### 3. Verify Database
```bash
mysql -u root -p carrer_nest -e "SHOW TABLES;"
```

You should see tables like:
- users
- hr_questions
- hr_question_items
- hr_answers
- technical_questions
- programming_questions
- video_questions
- quizzes
- etc.

### 4. Create Test User (Optional)

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', '$2a$10$hashedpassword', 'admin');
```

**Note:** Use the backend API to register users properly with hashed passwords.

## ❗ Common Issues

### Issue: Port Already in Use

**Backend (Port 5000):**
```bash
# Find process using port 5000
# Linux/macOS:
lsof -i :5000
# Windows:
netstat -ano | findstr :5000

# Kill the process
# Linux/macOS:
kill -9 <PID>
# Windows:
taskkill /PID <PID> /F
```

**Website (Port 5173):**
Similar process for port 5173.

**AI Server (Port 7860):**
Similar process for port 7860.

### Issue: MySQL Connection Failed

1. **Check if MySQL is running:**
   ```bash
   # Linux:
   sudo systemctl status mysql
   # macOS:
   brew services list
   # Windows:
   net start | findstr MySQL
   ```

2. **Check credentials:**
   - Verify username and password in `.env`
   - Try connecting manually: `mysql -u root -p`

3. **Check port:**
   - Default is 3306
   - Verify with: `mysql -u root -p -e "SHOW VARIABLES LIKE 'port';"`

### Issue: Python Packages Not Installing

1. **Upgrade pip:**
   ```bash
   pip install --upgrade pip
   ```

2. **Use specific Python version:**
   ```bash
   python3.9 -m pip install -r requirements.txt
   ```

3. **Install build tools:**
   - **Ubuntu:** `sudo apt install python3-dev build-essential`
   - **macOS:** `xcode-select --install`
   - **Windows:** Install Visual Studio Build Tools

### Issue: FFmpeg Not Found

1. **Verify installation:**
   ```bash
   which ffmpeg  # Linux/macOS
   where ffmpeg  # Windows
   ```

2. **Add to PATH:**
   - Ensure FFmpeg binary directory is in your system PATH

### Issue: Node Module Errors

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## ✔️ Verification

### Verify Backend
```bash
cd backend
npm run server
```

Visit: http://localhost:5000
Expected: Welcome message or API response

### Verify AI Server
```bash
cd ai_server
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

python app.py
```

Visit: http://localhost:7860
Expected: Welcome message

### Verify Website
```bash
cd website
npm run dev
```

Visit: http://localhost:5173
Expected: Career Nest login/home page

### Verify Flutter App
```bash
cd app
flutter doctor  # Check setup
flutter run     # Run on connected device/emulator
```

### Test Full Stack

1. Start all services:
   - Backend: `cd backend && npm run server`
   - AI Server: `cd ai_server && python app.py`
   - Website: `cd website && npm run dev`

2. Open browser to http://localhost:5173

3. Try registering a user and logging in

4. Create a quiz or upload a video (if admin)

## 🎉 Next Steps

Once your environment is set up:

1. Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide
2. Check out [open issues](https://github.com/anupnayak25/career_nest/issues)
3. Join discussions on GitHub
4. Start developing!

## 📞 Getting Help

If you encounter issues not covered here:

1. Check the [main README](README.md)
2. Search [existing issues](https://github.com/anupnayak25/career_nest/issues)
3. Create a new issue with:
   - Your OS and version
   - Error messages
   - Steps you've tried
   - Screenshots if applicable

---

Happy coding! 🚀
