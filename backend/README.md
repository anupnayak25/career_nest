# Backend API Server 🚀

> Node.js/Express REST API for Career Nest Assessment Platform

## 📖 Overview

The backend API server provides RESTful endpoints for authentication, assessment management, video handling, and
AI-powered evaluation orchestration. Built with Express.js and MySQL, it serves as the central hub connecting the mobile
app, web dashboard, and AI microservice.

## ✨ Features

- **🔐 JWT Authentication**: Secure token-based auth with bcrypt password hashing
- **📧 Email OTP Verification**: Nodemailer integration for account verification
- **🎥 Video Upload**: Multer-based video file handling (up to 150MB)
- **🤖 AI Integration**: Orchestrates video transcription and semantic evaluation
- **📊 Multi-Module Support**: HR, Technical, Programming, Quiz assessments
- **🔔 Push Notifications**: Firebase Cloud Messaging integration
- **📝 Comprehensive Logging**: Winston logger for activity tracking
- **🌐 CORS Support**: Configurable cross-origin resource sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Express.js Server                  │
├─────────────────────────────────────────────────┤
│  Middlewares                                    │
│  ├─ CORS                                        │
│  ├─ Body Parser (JSON/URL-encoded)             │
│  ├─ JWT Authentication (fetchUser)             │
│  └─ Static File Serving (/videos)              │
├─────────────────────────────────────────────────┤
│  Routes                                         │
│  ├─ /api/auth        - Authentication          │
│  ├─ /api/hr          - HR Questions            │
│  ├─ /api/technical   - Technical Questions     │
│  ├─ /api/programming - Programming Challenges  │
│  ├─ /api/quiz        - Quizzes                 │
│  ├─ /api/videos      - Video Management        │
│  ├─ /api/evaluate    - AI Evaluation Trigger   │
│  └─ /api/notification - Push Notifications     │
├─────────────────────────────────────────────────┤
│  Services                                       │
│  ├─ aiClient.js         - HTTP client to AI    │
│  └─ evaluationService.js - Evaluation logic    │
├─────────────────────────────────────────────────┤
│  Database (MySQL)                               │
│  └─ Connection Pool (10 connections)           │
└─────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create `.env` file in the `backend/` directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=carrer_nest

   # Or use connection URL
   DB_URL=mysql://user:pass@host:port/carrer_nest?ssl-mode=REQUIRED

   # JWT Secret
   SECRET_KEY=your_super_secret_jwt_key_here

   # AI Server
   AI_SERVER_URL=http://localhost:7860
   BACKEND_PUBLIC_BASE=http://localhost:5000

   # Email Service (Gmail SMTP)
   EMAIL=your_email@gmail.com
   APP_PASSWORD=your_gmail_app_password

   # Server
   PORT=5000
   ```

3. **Setup database**

   ```bash
   mysql -u root -p
   ```

   ```sql
   CREATE DATABASE carrer_nest;
   USE carrer_nest;
   SOURCE ../app/lib/student/common/carrer_nest_new.sql;
   ```

4. **Start the server**

   Development mode (with auto-restart):

   ```bash
   npm run server
   ```

   Development with auto-fetcher:

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   node server.js
   ```

Server will run at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js                   # Main server entry point
├── db.js                       # MySQL connection pool
├── logger.js                   # Winston logging setup
├── package.json               # Dependencies
├── vercel.json                # Vercel deployment config
│
├── middlewares/
│   └── fetchUser.js           # JWT authentication middleware
│
├── models/                    # Database models (schemas)
│   ├── HR.js
│   ├── Technical.js
│   ├── Programming.js
│   ├── Quiz.js
│   └── Video.js
│
├── routes/                    # API route handlers
│   ├── authenticateRoutes.js  # Auth (signup/signin/OTP)
│   ├── hrRoutes.js            # HR questions CRUD + answers
│   ├── technicalRoutes.js     # Technical questions CRUD
│   ├── programmingRoutes.js   # Programming challenges
│   ├── quizRoutes.js          # Quiz CRUD + auto-grading
│   ├── videoRoutes.js         # Video upload/management
│   ├── evaluateRoutes.js      # AI evaluation triggers
│   ├── notificationRoutes.js  # FCM push notifications
│   └── firebase.js            # Firebase config
│
├── services/                  # Business logic
│   ├── aiClient.js            # HTTP client for AI server
│   └── evaluationService.js   # Evaluation orchestration
│
├── scripts/                   # Utility scripts
│   ├── db-ping.js             # Database health check
│   └── run-evaluation.js      # Manual evaluation runner
│
├── videos/                    # Uploaded video storage
├── assets/                    # Static assets (logos)
└── logs/                      # Application logs
    └── app.log
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint           | Description                | Auth Required |
| ------ | ------------------ | -------------------------- | ------------- |
| POST   | `/signup`          | Register new user with OTP | ❌            |
| POST   | `/signin`          | Login with email/password  | ❌            |
| POST   | `/otp`             | Send OTP to email          | ❌            |
| POST   | `/verify-otp`      | Verify OTP code            | ❌            |
| PUT    | `/forgot`          | Reset password with OTP    | ❌            |
| GET    | `/getusers`        | Get current user details   | ✅            |
| PUT    | `/update-details`  | Update user profile        | ✅            |
| PUT    | `/update-password` | Change password            | ✅            |

**Example: Signup**

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "student"
}

Response:
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "John Doe",
  "email": "john@example.com",
  "type": "student",
  "id": 42
}
```

### HR Questions (`/api/hr`)

| Method | Endpoint                      | Description                                 | Auth |
| ------ | ----------------------------- | ------------------------------------------- | ---- |
| GET    | `/`                           | Get all HR sets with questions              | ✅   |
| GET    | `/:id`                        | Get specific HR set items                   | ✅   |
| GET    | `/user/:id`                   | Get sets by faculty                         | ✅   |
| POST   | `/`                           | Create new HR set (auto-transcribes videos) | ✅   |
| PUT    | `/:id`                        | Update HR set                               | ✅   |
| DELETE | `/:id`                        | Delete HR set                               | ✅   |
| POST   | `/answers`                    | Submit student answers                      | ✅   |
| GET    | `/answers/:id`                | Get users who answered                      | ✅   |
| GET    | `/answers/:id/:user_id`       | Get user's answers                          | ✅   |
| PUT    | `/answers/:id/:user_id/marks` | Update marks                                | ✅   |
| PUT    | `/publish/:id`                | Publish/unpublish results                   | ✅   |
| GET    | `/attempted/:id`              | Get user's attempted sets                   | ✅   |

**Example: Create HR Set with Video Transcription**

```bash
POST /api/hr
Authorization: Bearer <token>
Content-Type: application/json

{
  "hrQuestion": {
    "title": "HR Interview Set 1",
    "description": "Communication skills",
    "publish_date": "2025-11-21T00:00:00Z",
    "due_date": "2025-11-28T23:59:59Z",
    "totalMarks": 20
  },
  "hrQuestionItems": [
    {
      "qno": 1,
      "question": "Introduce yourself",
      "marks": 5,
      "answer_url": "video-teacher-intro.mp4"  // Auto-transcribed
    }
  ]
}
```

### Technical Questions (`/api/technical`)

Similar structure to HR with auto-transcription support.

### Programming (`/api/programming`)

Code submission and manual evaluation support.

### Quiz (`/api/quiz`)

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/getquizpool?limit=10` | Random questions from expired quizzes |
| POST   | `/answers`              | Submit quiz (auto-graded)             |

**Example: Auto-Graded Quiz Submission**

```bash
POST /api/quiz/answers
Authorization: Bearer <token>

{
  "quiz_id": 5,
  "answers": [
    {"qno": 1, "selected_ans": "Option A"},
    {"qno": 2, "selected_ans": "Option C"}
  ]
}

Response:
{
  "message": "Answers submitted successfully",
  "total_marks_awarded": 8
}
```

### Video Management (`/api/videos`)

| Method | Endpoint           | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| POST   | `/upload`          | Upload single video (multipart/form-data) |
| POST   | `/upload-multiple` | Upload up to 10 videos                    |
| POST   | `/`                | Save video metadata to DB                 |
| GET    | `/`                | Get all videos                            |
| GET    | `/user/:userId`    | Get user's videos                         |
| DELETE | `/:videoId`        | Delete video (file + DB)                  |

**Example: Video Upload**

```bash
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: [binary file data]

Response:
{
  "success": true,
  "message": "Video uploaded successfully!",
  "filename": "video-1732185234050-123456789.mp4",
  "url": "video-1732185234050-123456789.mp4"
}
```

### AI Evaluation (`/api/evaluate`)

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| POST   | `/batch`              | Batch evaluate multiple users       |
| POST   | `/:id`                | Evaluate all/specific users for set |
| GET    | `/:id/status?type=hr` | Get evaluation status               |
| GET    | `/health`             | Check AI server connectivity        |

**Example: Trigger Batch Evaluation**

```bash
POST /api/evaluate/batch
Authorization: Bearer <token>

{
  "type": "hr",
  "setId": 1,
  "userIds": [87, 88, 89]
}

Response:
{
  "type": "hr",
  "setId": 1,
  "total": 3,
  "summary": [
    {
      "userId": 87,
      "ok": true,
      "count": 3,
      "results": [
        {"qno": 1, "marks_awarded": 4, "score": 85.7}
      ]
    }
  ]
}
```

## 🔧 Services

### AI Client (`services/aiClient.js`)

HTTP client for communicating with Python AI server:

```javascript
const { transcribe, score, ping } = require("./services/aiClient");

// Transcribe video
const result = await transcribe("http://example.com/video.mp4");
// { transcript: "Transcribed text..." }

// Score similarity
const similarity = await score("Expected answer", "Student answer");
// { score: 85.67 }

// Health check
await ping();
```

### Evaluation Service (`services/evaluationService.js`)

Orchestrates video transcription and scoring:

```javascript
const { evaluateHrSet, evaluateTechnicalSet } = require("./services/evaluationService");

// Evaluate all HR answers for a user
const result = await evaluateHrSet(hrSetId, userId);
// {
//   count: 3,
//   results: [
//     {qno: 1, marks_awarded: 4, score: 85.7},
//     {qno: 2, marks_awarded: 3, score: 72.3}
//   ]
// }
```

## 🔐 Authentication Flow

```
1. User requests OTP
   POST /api/auth/otp → Email sent with 6-digit code

2. User verifies OTP
   POST /api/auth/verify-otp → Email marked as verified

3. User signs up
   POST /api/auth/signup → JWT token issued

4. User makes authenticated requests
   Headers: { Authorization: "Bearer <token>" }

5. Middleware validates token
   fetchUser extracts user ID → req.user.id
```

## 🎥 Video Workflow

```
1. Student records video (mobile app)
2. Upload video: POST /api/videos/upload
3. Backend saves to /backend/videos/video-123.mp4
4. Student submits answer with filename
5. Faculty triggers evaluation
6. Backend calls AI server with URL: http://backend/videos/video-123.mp4
7. AI server downloads, transcribes, scores
8. Marks updated in database
```

## 📊 Database Connection

The server uses MySQL connection pooling for optimal performance:

```javascript
// db.js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});
```

Supports SSL for cloud databases (Aiven):

```env
DB_URL=mysql://user:pass@host:port/db?ssl-mode=REQUIRED
SSL_CERT_BASE64=<base64_encoded_certificate>
```

## 🛠️ Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run server`   | Start server with nodemon (auto-reload)  |
| `npm run dev`      | Start server + auto-fetcher concurrently |
| `npm run eval:run` | Manual evaluation runner script          |
| `npm run db:ping`  | Test database connection                 |

**Manual Evaluation Example:**

```bash
node scripts/run-evaluation.js hr 1 87
# Evaluates HR set 1 for user 87
```

## 📝 Logging

Winston logger configured to log to console and file:

```javascript
// View logs
curl http://localhost:5000/api/logs

// Logs include:
// - HTTP requests (method, URL, timestamp)
// - Database queries
// - AI server calls
// - Errors and exceptions
```

## 🚨 Error Handling

Global error handlers for safety:

```javascript
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[FATAL] Unhandled Rejection:", reason);
  process.exit(1);
});
```

## 🌐 CORS Configuration

```javascript
app.use(
  cors({
    origin: true, // Development: allow all origins
    credentials: true,
  })
);

// Production: Whitelist specific origins
// origin: ['https://career-nest.vercel.app']
```

## 🚀 Deployment

### Vercel (Serverless)

```bash
npm install -g vercel
vercel login
vercel --prod
```

`vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Traditional VPS

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name career-nest-api

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

## 🧪 Testing

### Test Database Connection

```bash
npm run db:ping
```

### Test AI Server Integration

```bash
curl http://localhost:5000/api/evaluate/health
```

### Test Authentication

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"student"}'
```

## 📚 Dependencies

**Core:**

- `express` - Web framework
- `mysql2` - MySQL client
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

**Middleware:**

- `cors` - Cross-origin support
- `body-parser` - Request parsing
- `multer` - File upload handling

**Utilities:**

- `axios` - HTTP client (AI server)
- `nodemailer` - Email service
- `winston` - Logging
- `dotenv` - Environment variables
- `uuid` - Unique ID generation

**Development:**

- `nodemon` - Auto-reload
- `concurrently` - Run multiple processes

## 🤝 Contributing

1. Follow Express.js best practices
2. Use async/await for database queries
3. Add proper error handling
4. Update this README for new endpoints
5. Test with Postman before committing

## 📞 Support

- 📧 Email: nnm24mc014@nmamit.in
- 🐛 Issues: [GitHub Issues](https://github.com/anupnayak25/career_nest/issues)

---

Made with ❤️ using Node.js and Express
