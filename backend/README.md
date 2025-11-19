# Career Nest Backend API

Node.js/Express backend server for the Career Nest platform, providing RESTful APIs for quiz management, video interviews, and AI-powered evaluation.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Services](#services)
- [Middleware](#middleware)
- [Scripts](#scripts)
- [Error Handling](#error-handling)
- [Testing](#testing)

## 🌟 Overview

The backend server handles:
- User authentication and authorization (JWT)
- CRUD operations for questions and answers
- File uploads (video interviews)
- Integration with AI server for automated evaluation
- Real-time notifications via Firebase Cloud Messaging
- Batch processing of student evaluations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MySQL 8.0 with mysql2 driver
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: express-validator
- **Logging**: Winston
- **HTTP Client**: Axios (for AI server communication)
- **Security**: bcryptjs for password hashing
- **Notifications**: Firebase Admin SDK

## 📦 Installation

### Prerequisites

- Node.js v18 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Install Dependencies

```bash
cd backend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=carrer_nest

# For Database URL (alternative to discrete configs)
# DB_URL=mysql://user:password@host:port/database?ssl-mode=REQUIRED

# SSL Configuration (optional)
# SSL_MODE=REQUIRED
# SSL_CERT=/path/to/ca-certificate.crt
# or
# SSL_CERT_BASE64=base64_encoded_certificate
# or
# SSL_CERT=-----BEGIN CERTIFICATE-----\nMII...\n-----END CERTIFICATE-----

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# AI Server Configuration
AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000

# Firebase Configuration (for push notifications)
# Place your Firebase service account JSON in the backend directory
# FIREBASE_CONFIG_PATH=./firebase-service-account.json
```

### Environment Variable Details

- **PORT**: Port on which the server will run (default: 5000)
- **DB_HOST**: MySQL database host
- **DB_PORT**: MySQL database port (default: 3306)
- **DB_USER**: Database username
- **DB_PASSWORD**: Database password
- **DB_NAME**: Database name
- **JWT_SECRET**: Secret key for JWT token generation (use a strong, random string)
- **AI_SERVER_URL**: Base URL of the AI server for video transcription and evaluation
- **BACKEND_PUBLIC_BASE**: Public base URL for accessing uploaded videos

## 💾 Database Setup

### Import Schema

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE carrer_nest;

# Import schema
mysql -u your_user -p carrer_nest < carrer_nest.sql
```

### Database Connection

The application uses a connection pool for better performance. Configuration is in `db.js`:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### Test Database Connection

```bash
npm run db:ping
```

## 🚀 Running the Server

### Development Mode

```bash
# Start server with auto-reload and auto-fetcher
npm run dev

# Start server only with auto-reload
npm run server
```

### Production Mode

```bash
node server.js
```

The server will be available at `http://localhost:5000` (or your configured PORT).

## 📡 API Endpoints

### Authentication

#### Register User
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

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 123
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

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### HR Questions

#### Get All HR Question Sets
```http
GET /api/hr/questions
Authorization: Bearer <token>
```

#### Get HR Question Set by ID
```http
GET /api/hr/questions/:id
Authorization: Bearer <token>
```

#### Create HR Question Set (Admin only)
```http
POST /api/hr/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "HR Set 1",
  "description": "General HR questions",
  "due_date": "2024-12-31T23:59:59Z",
  "total_marks": 50,
  "questions": [
    {
      "qno": 1,
      "question": "Tell me about yourself",
      "marks": 10
    }
  ]
}
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

### Technical Questions

Similar endpoints as HR questions:
- `GET /api/technical/questions`
- `GET /api/technical/questions/:id`
- `POST /api/technical/questions` (Admin)
- `POST /api/technical/submit`

### Programming Questions

Similar endpoints:
- `GET /api/programming/questions`
- `GET /api/programming/questions/:id`
- `POST /api/programming/questions` (Admin)
- `POST /api/programming/submit`

### Video Interviews

#### Upload Video
```http
POST /api/video/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
```

Response:
```json
{
  "success": true,
  "filename": "video-1234567890.mp4",
  "url": "http://localhost:5000/videos/video-1234567890.mp4"
}
```

#### Get Video Question Sets
```http
GET /api/video/questions
Authorization: Bearer <token>
```

#### Submit Video Answer
```http
POST /api/video/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "video_question_id": 1,
  "qno": 1,
  "answer": "video-1234567890.mp4"
}
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

Response:
```json
{
  "type": "hr",
  "setId": 1,
  "total": 2,
  "summary": [
    {
      "userId": 87,
      "ok": true,
      "count": 3,
      "results": [
        {
          "qno": 1,
          "marks_awarded": 8,
          "score": 85.5
        }
      ]
    }
  ]
}
```

### Quizzes

#### Get Quiz Sets
```http
GET /api/quiz/questions
Authorization: Bearer <token>
```

#### Submit Quiz Answers
```http
POST /api/quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quiz_id": 1,
  "answers": [
    {
      "qno": 1,
      "selected_option": "A"
    }
  ]
}
```

### Notifications

#### Send Notification (Admin only)
```http
POST /api/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "userIds": [87, 88],
  "title": "New Quiz Available",
  "body": "A new HR quiz has been published"
}
```

## 🔧 Services

### Evaluation Service (`services/evaluationService.js`)

Handles AI-powered evaluation of student answers:

```javascript
const { evaluateBatch } = require('./services/evaluationService');

// Evaluate all answers for specific users in a question set
const results = await evaluateBatch('hr', setId, userIds);
```

Features:
- Fetches answers from database
- Transcribes video answers using AI server
- Scores answers using semantic similarity
- Updates marks in database

### AI Client (`services/aiClient.js`)

Communicates with the AI server:

```javascript
const aiClient = require('./services/aiClient');

// Transcribe video
const transcript = await aiClient.transcribe(videoUrl);

// Score text similarity
const score = await aiClient.score(expectedText, studentText);
```

## 🔐 Middleware

### Authentication (`middlewares/fetchUser.js`)

Verifies JWT tokens and attaches user info to request:

```javascript
const fetchUser = require('./middlewares/fetchUser');

router.get('/protected', fetchUser, (req, res) => {
  // req.user contains authenticated user info
  console.log(req.user.id, req.user.role);
});
```

### Role-based Authorization

```javascript
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

## 📜 Scripts

### Database Ping
```bash
npm run db:ping
```
Tests database connectivity.

### Run Evaluation
```bash
npm run eval:run -- <type> <setId> <userId>

# Example:
npm run eval:run -- hr 1 87
npm run eval:run -- technical 1 88
```

Runs evaluation for a specific user without going through the API.

## ⚠️ Error Handling

The server implements comprehensive error handling:

### Global Error Handlers

```javascript
// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});
```

### API Error Responses

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Manual Testing with cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get HR questions (with token)
curl http://localhost:5000/api/hr/questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 File Structure

```
backend/
├── models/                 # Database models
│   ├── HR.js
│   ├── Technical.js
│   ├── Programming.js
│   ├── Quiz.js
│   └── Video.js
├── routes/                 # API routes
│   ├── hrRoutes.js
│   ├── technicalRoutes.js
│   ├── programmingRoutes.js
│   ├── quizRoutes.js
│   ├── videoRoutes.js
│   ├── evaluateRoutes.js
│   ├── notificationRoutes.js
│   └── firebase.js
├── services/               # Business logic
│   ├── evaluationService.js
│   └── aiClient.js
├── middlewares/            # Express middlewares
│   └── fetchUser.js
├── scripts/                # Utility scripts
│   ├── db-ping.js
│   └── run-evaluation.js
├── videos/                 # Uploaded video files
├── server.js              # Main server file
├── db.js                  # Database connection
├── logger.js              # Winston logger
├── auto-fetcher.js        # Background job processor
├── carrer_nest.sql        # Database schema
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔍 Logging

The server uses Winston for logging:

```javascript
const logger = require('./logger');

logger.info('Server started');
logger.error('An error occurred', { error: err });
```

Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## 🚀 Performance Optimization

- **Connection Pooling**: MySQL connection pool for efficient database access
- **File Streaming**: Large video files are streamed rather than loaded into memory
- **Async Processing**: Long-running tasks (AI evaluation) can be run asynchronously
- **Caching**: Consider implementing Redis for session/result caching in production

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Password Hashing**: Using bcryptjs with salt rounds
3. **JWT Tokens**: Expire tokens after reasonable time
4. **Input Validation**: Using express-validator
5. **CORS**: Configure properly for production
6. **SQL Injection**: Using parameterized queries
7. **File Upload**: Validate file types and sizes

## 📊 Monitoring

For production deployment, consider:
- PM2 for process management
- New Relic or similar for application monitoring
- MySQL slow query log analysis
- Winston transports for centralized logging

## 🤝 Contributing

See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📝 License

This project is for educational purposes.
