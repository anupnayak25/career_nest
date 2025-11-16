# Career Nest 🎓

A comprehensive career preparation platform that helps students practice and improve their skills through AI-powered assessments, quizzes, and video interviews.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Career Nest is a multi-platform application designed to help students prepare for their careers through:
- **Interactive Quizzes**: Technical, HR, and Programming assessments
- **Video Interviews**: AI-powered video interview practice with automated evaluation
- **Real-time Feedback**: Get instant scores and feedback on your performance
- **Admin Dashboard**: Comprehensive management tools for educators

## ✨ Features

### For Students
- 📝 Take Technical, HR, and Programming quizzes
- 🎥 Practice video interviews with AI evaluation
- 📊 View performance metrics and scores
- 📱 Access via web or mobile app
- 🔐 Secure authentication with JWT

### For Administrators
- ➕ Create and manage question sets
- 📹 Upload and manage video interview questions
- 📈 Monitor student performance
- 🤖 Trigger AI-powered batch evaluations
- 🔔 Send notifications to students

### AI-Powered Features
- 🎤 Video-to-text transcription using Whisper
- 🧠 Semantic similarity scoring using Sentence Transformers
- ⚡ Automated batch evaluation of student responses
- 📊 Intelligent scoring based on context understanding

## 🏗️ Architecture

Career Nest follows a modern microservices architecture:

```
┌─────────────────┐     ┌─────────────────┐
│  Flutter App    │     │  React Website  │
│  (Mobile)       │     │  (Web)          │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │    HTTP/REST API      │
         └───────────┬───────────┘
                     │
            ┌────────▼────────┐
            │   Backend API   │
            │  (Node.js)      │
            └────┬─────┬──────┘
                 │     │
        ┌────────┘     └────────┐
        │                       │
   ┌────▼────┐           ┌──────▼──────┐
   │  MySQL  │           │  AI Server  │
   │Database │           │  (Python)   │
   └─────────┘           └─────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: express-validator
- **Logging**: Winston

### Frontend (Website)
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Mobile App
- **Framework**: Flutter/Dart
- **Platform**: Android & iOS
- **State Management**: Flutter built-in

### AI Server
- **Language**: Python 3.8+
- **Framework**: Flask
- **Speech-to-Text**: OpenAI Whisper
- **Semantic Analysis**: Sentence Transformers
- **Video Processing**: FFmpeg
- **Deployment**: Gunicorn

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **MySQL** (8.0 or higher)
- **Flutter SDK** (for mobile app development)
- **FFmpeg** (for video processing)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/anupnayak25/career_nest.git
cd career_nest
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=carrer_nest
JWT_SECRET=your_jwt_secret_key
AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000
EOF

# Import database schema
mysql -u your_db_user -p carrer_nest < carrer_nest.sql

# Start the server
npm run server
```

The backend will be available at `http://localhost:5000`

#### 3. Setup AI Server

```bash
cd ai_server

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install FFmpeg (if not already installed)
# Ubuntu/Debian:
sudo apt update && sudo apt install ffmpeg
# macOS:
brew install ffmpeg

# Start the AI server
python app.py
```

The AI server will be available at `http://localhost:7860`

#### 4. Setup Website

```bash
cd website

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start development server
npm run dev
```

The website will be available at `http://localhost:5173`

#### 5. Setup Flutter App (Optional)

```bash
cd app

# Get Flutter dependencies
flutter pub get

# Run the app (ensure you have an emulator running or device connected)
flutter run
```

## 📁 Project Structure

```
career_nest/
├── backend/                 # Node.js backend server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── middlewares/        # Express middlewares
│   ├── scripts/            # Utility scripts
│   ├── videos/             # Uploaded video files
│   ├── server.js           # Main server file
│   ├── db.js               # Database connection
│   └── carrer_nest.sql     # Database schema
│
├── website/                # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── context/        # React context
│   │   └── ui/             # UI components
│   └── package.json
│
├── ai_server/              # Python AI server
│   ├── app.py              # Main Flask application
│   ├── whisper_service.py  # Video transcription
│   ├── evaluation_service.py # Answer evaluation
│   ├── utils.py            # Utility functions
│   └── requirements.txt
│
├── app/                    # Flutter mobile app
│   ├── lib/
│   │   ├── admin/          # Admin features
│   │   ├── student/        # Student features
│   │   └── models/         # Data models
│   └── pubspec.yaml
│
└── nativeApp/              # Native Android app
    └── android/
```

## 🔧 Components

### Backend API Server

The backend provides RESTful APIs for:
- User authentication and authorization
- Quiz management (HR, Technical, Programming)
- Video interview management
- Answer submission and evaluation
- AI-powered batch evaluation
- Notification system

**Key Files:**
- `server.js` - Main Express server
- `db.js` - MySQL connection pool
- `routes/` - API endpoint definitions
- `services/evaluationService.js` - AI evaluation integration

### Website (React)

Modern web interface built with React and Vite:
- Responsive design with Tailwind CSS
- Student and Admin dashboards
- Quiz attempt and review system
- Video upload and playback
- Real-time score display

### AI Server (Python/Flask)

Handles AI-powered features:
- Video transcription using Whisper
- Semantic similarity analysis
- Answer scoring and evaluation
- Batch processing capabilities

**Endpoints:**
- `POST /transcribe` - Transcribe video to text
- `POST /evaluate` - Evaluate video against expected answer
- `POST /score` - Score text similarity

### Mobile App (Flutter)

Cross-platform mobile application:
- Native Android and iOS support
- Student quiz interface
- Video recording and upload
- Dashboard and results view

## 💾 Database Schema

The application uses MySQL with the following main tables:

### Users & Authentication
- `users` - User accounts (students and admins)
- `fcm_tokens` - Firebase Cloud Messaging tokens

### HR Module
- `hr_questions` - HR question sets
- `hr_question_items` - Individual questions
- `hr_answers` - Student answers

### Technical Module
- `technical_questions` - Technical question sets
- `technical_question_items` - Individual questions
- `technical_answers` - Student answers

### Programming Module
- `programming_questions` - Programming question sets
- `programming_question_items` - Individual questions
- `programming_answers` - Student answers

### Video Interviews
- `video_questions` - Video interview question sets
- `video_question_items` - Individual video questions
- `video_answers` - Student video responses

### Quizzes
- `quizzes` - General quiz sets
- `quiz_questions` - Quiz questions with multiple choice
- `quiz_answers` - Student quiz responses

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token for authentication.

### Quiz Management

#### Get HR Questions
```http
GET /api/hr/questions
Authorization: Bearer <token>
```

#### Submit HR Answer
```http
POST /api/hr/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "hr_question_id": 1,
  "qno": 1,
  "answer": "My answer text or video-filename.mp4"
}
```

### Video Interviews

#### Upload Video
```http
POST /api/video/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
```

#### Get Video Questions
```http
GET /api/video/questions
Authorization: Bearer <token>
```

### AI Evaluation

#### Batch Evaluate Answers
```http
POST /api/evaluate/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "hr",
  "setId": 1,
  "userIds": [87, 88]
}
```

For more detailed API documentation, see [backend/README_AI_INTEGRATION.md](backend/README_AI_INTEGRATION.md)

## 🚢 Deployment

### Backend Deployment

1. **Environment Setup**
   - Set production environment variables
   - Configure MySQL database
   - Set up SSL certificates (if needed)

2. **Deploy to Cloud**
   ```bash
   # Example for Node.js hosting
   npm install --production
   node server.js
   ```

3. **Database Migration**
   ```bash
   mysql -u user -p database < carrer_nest.sql
   ```

### AI Server Deployment

```bash
# Using Gunicorn for production
gunicorn -w 4 -b 0.0.0.0:7860 app:app
```

### Website Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=carrer_nest
JWT_SECRET=your_jwt_secret
AI_SERVER_URL=http://your-ai-server:7860
BACKEND_PUBLIC_BASE=http://your-backend-url
```

#### Website (.env)
```env
VITE_API_URL=http://your-backend-url
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is for educational and demonstration purposes.

## 👥 Authors

- Anup Nayak - [@anupnayak25](https://github.com/anupnayak25)

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Sentence Transformers for semantic analysis
- All contributors and supporters of this project

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

**Note**: This is an educational project developed as part of III Semester MCA Mini Project.
