# Career Nest 🎓

> **AI-Powered Multi-Module Assessment and Evaluation System**

A comprehensive, full-stack platform that revolutionizes educational assessments through AI-driven video interview
analysis, automated grading, and multi-format question modules.

[![Flutter](https://img.shields.io/badge/Flutter-3.6.1-blue.svg)](https://flutter.dev/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-Flask-yellow.svg)](https://www.python.org/)

## 📖 Overview

Career Nest is an intelligent assessment platform designed for educational institutions, featuring:

- **🎥 AI-Powered Video Interviews**: Automatic transcription using OpenAI Whisper and semantic evaluation
- **📝 Multi-Format Assessments**: HR interviews, technical questions, programming challenges, and MCQ quizzes
- **📱 Cross-Platform**: Flutter mobile app for students, React web dashboard for faculty
- **🤖 Automated Grading**: Reduce manual evaluation time by 70% with AI-driven scoring
- **🔔 Real-time Notifications**: Firebase Cloud Messaging for instant updates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Career Nest Platform                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Mobile App    │  Web Dashboard  │     Backend APIs        │
│   (Flutter)     │    (React)      │    (Node.js/Express)    │
│   Students      │    Faculty      │                         │
└────────┬────────┴────────┬────────┴──────────┬──────────────┘
         │                 │                   │
         └─────────────────┴───────────────────┤
                                               │
                    ┌──────────────────────────┴─────────┐
                    │         MySQL Database             │
                    │      (Users, Questions, Answers)   │
                    └──────────────────────────┬─────────┘
                                               │
                    ┌──────────────────────────┴─────────┐
                    │      Python AI Server (Flask)      │
                    │  - OpenAI Whisper (Transcription)  │
                    │  - Sentence Transformers (Scoring) │
                    └────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.8+
- **MySQL** 8.0+
- **Flutter** 3.6+ (for mobile app)
- **ffmpeg** (for video processing)

### 1. Clone the Repository

```bash
git clone https://github.com/anupnayak25/career_nest.git
cd career_nest
```

### 2. Setup Database

```bash
cd backend
mysql -u root -p
```

```sql
CREATE DATABASE carrer_nest;
USE carrer_nest;
SOURCE app/lib/student/common/carrer_nest_new.sql;
```

### 3. Setup Backend API Server

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run server
```

Server runs at: `http://localhost:5000`

### 4. Setup AI Server

```bash
cd ai_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

AI Server runs at: `http://localhost:7860`

### 5. Setup Web Dashboard (Faculty)

```bash
cd website
npm install
npm run dev
```

Web dashboard runs at: `http://localhost:5173`

### 6. Setup Mobile App (Students)

```bash
cd app
flutter pub get
flutter run
```

## 📂 Project Structure

```
career_nest/
├── ai_server/              # Python Flask AI microservice
│   ├── app.py              # Main Flask app
│   ├── whisper_service.py  # Video transcription
│   ├── evaluation_service.py # Semantic scoring
│   └── requirements.txt
│
├── backend/                # Node.js Express API
│   ├── server.js           # Main server
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   └── package.json
│
├── app/                    # Flutter mobile app
│   ├── lib/
│   │   ├── student/        # Student features
│   │   ├── admin/          # Faculty features
│   │   ├── common/         # Shared components
│   │   └── widgets/
│   └── pubspec.yaml
│
├── website/                # React web dashboard
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   └── context/        # State management
│   └── package.json
│
└── README.md               # This file
```

## 🎯 Key Features

### For Students (Mobile App)

- ✅ View and attempt assessments (HR, Technical, Programming, Quizzes)
- 🎥 Record video interview responses with in-app camera
- 📊 Track progress and view results
- 🎲 Practice with Quiz Pool (random questions from past quizzes)
- 🔔 Receive push notifications for new assignments

### For Faculty (Web Dashboard)

- 📝 Create multi-format assessments with rich question types
- 🤖 Trigger AI-powered batch evaluation
- 📹 Upload reference answer videos with auto-transcription
- 👥 View student submissions and manually adjust marks
- 📈 Manage video library by category
- 🔓 Publish/unpublish results

### AI-Powered Features

- 🎤 **Speech-to-Text**: OpenAI Whisper converts video answers to text
- 🧠 **Semantic Scoring**: Sentence Transformers measure answer similarity
- ⚡ **Batch Processing**: Evaluate multiple students simultaneously
- 🎯 **Accuracy**: 85%+ semantic matching accuracy

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register with OTP verification
- `POST /api/auth/signin` - Login with JWT
- `POST /api/auth/otp` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Assessments

- `GET /api/hr` - Get all HR question sets
- `POST /api/hr` - Create HR set (with video transcription)
- `POST /api/hr/answers` - Submit answers
- `GET /api/technical`, `POST /api/technical` - Technical module
- `GET /api/quiz`, `POST /api/quiz` - Quiz module
- `GET /api/programming`, `POST /api/programming` - Programming module

### AI Evaluation

- `POST /api/evaluate/batch` - Batch evaluate students
- `POST /api/evaluate/:id` - Evaluate specific set
- `GET /api/evaluate/:id/status` - Check evaluation status
- `GET /api/evaluate/health` - AI server health check

### Video Management

- `POST /api/videos/upload` - Upload video file
- `GET /api/videos` - Get all videos
- `DELETE /api/videos/:id` - Delete video

### AI Server (Python Flask)

- `POST /transcribe` - Transcribe video to text
- `POST /evaluate` - Transcribe + score against expected answer
- `POST /score` - Score similarity between two texts

📚 **[View Full API Documentation](./backend/README.md)**

## 🛠️ Tech Stack

| Layer                | Technology                                           |
| -------------------- | ---------------------------------------------------- |
| **Mobile App**       | Flutter, Dart, Provider, Firebase                    |
| **Web Frontend**     | React 19, Vite, TailwindCSS, React Router            |
| **Backend API**      | Node.js, Express.js, JWT, bcrypt                     |
| **AI/ML**            | Python, Flask, OpenAI Whisper, Sentence Transformers |
| **Database**         | MySQL 8.0, mysql2 driver                             |
| **Video Processing** | ffmpeg, Multer                                       |
| **Notifications**    | Firebase Cloud Messaging                             |
| **Deployment**       | Vercel (backend/web), Aiven (database)               |

## 📊 Database Schema

**Main Tables:**

- `user` - User accounts (students, faculty)
- `hr_questions`, `hr_question_items`, `hr_answers` - HR module
- `technical_questions`, `technical_question_items`, `technical_answers` - Technical module
- `program_sets`, `program_questions`, `program_answers` - Programming module
- `quizzes`, `quiz_questions`, `quiz_answers` - Quiz module
- `videos` - Video library metadata

📚 **[View Complete Schema](./app/lib/student/common/carrer_nest_new.sql)**

## 🔐 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=carrer_nest
SECRET_KEY=your_jwt_secret_key
AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000
EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_password
```

### Flutter (.env)

```env
API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend API

```bash
cd backend
npm run eval:run  # Run evaluation script
npm run db:ping   # Test database connection
```

### AI Server

```bash
# Test transcription
curl -X POST http://localhost:7860/transcribe \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "http://example.com/video.mp4"}'
```

## 📦 Deployment

### Backend (Vercel)

```bash
cd backend
vercel --prod
```

### Web Dashboard (Vercel)

```bash
cd website
npm run build
vercel --prod
```

### AI Server (Custom VPS)

```bash
cd ai_server
gunicorn -w 4 -b 0.0.0.0:7860 app:app
```

### Mobile App

```bash
cd app
flutter build apk  # Android
flutter build ios  # iOS
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for educational purposes as part of an MCA Mini Project.

## 👥 Authors

- **Anup Nayak** - [@anupnayak25](https://github.com/anupnayak25)

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Sentence Transformers for semantic similarity
- Flutter and React communities
- NMAM Institute of Technology

## 📞 Support

For issues and questions:

- 📧 Email: nnm24mc014@nmamit.in
- 🐛 Issues: [GitHub Issues](https://github.com/anupnayak25/career_nest/issues)

---

<p align="center">
  Made with ❤️ for better education
</p>
