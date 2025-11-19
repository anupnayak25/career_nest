# API Documentation

Comprehensive API documentation for Career Nest backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [HR Questions](#hr-questions-endpoints)
  - [Technical Questions](#technical-questions-endpoints)
  - [Programming Questions](#programming-questions-endpoints)
  - [Quizzes](#quiz-endpoints)
  - [Video Interviews](#video-interview-endpoints)
  - [Evaluation](#evaluation-endpoints)
  - [Notifications](#notification-endpoints)

## 🌟 Overview

The Career Nest API provides RESTful endpoints for managing quizzes, video interviews, and AI-powered evaluations. All endpoints return JSON responses and require authentication (except login/register).

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Obtaining a Token

Send a POST request to `/api/auth/login` with your credentials. The response will include a JWT token.

### Using the Token

Include the token in the `Authorization` header of all subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after 24 hours. You'll receive a 401 Unauthorized response if your token is expired or invalid.

## 🌐 Base URL

### Development
```
http://localhost:5000
```

### Production
```
https://api.yourdomain.com
```

All endpoints are prefixed with `/api` (e.g., `/api/auth/login`).

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

### Error Response Example

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

## 🚦 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info is included in response headers
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## 📡 Endpoints

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Authentication**: Not required

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student"
}
```

**Fields**:
- `name` (string, required): User's full name
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 6 characters
- `role` (string, optional): Either "student" or "admin" (default: "student")

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 123
}
```

**Errors**:
- 400: Invalid input
- 409: Email already registered

---

### Login

Authenticate and receive a JWT token.

**Endpoint**: `POST /api/auth/login`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
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

**Errors**:
- 400: Missing credentials
- 401: Invalid credentials

---

## HR Questions Endpoints

### Get All HR Question Sets

Retrieve all HR question sets.

**Endpoint**: `GET /api/hr/questions`

**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "HR Set 1",
      "description": "General HR questions",
      "publish_date": "2024-01-01T00:00:00.000Z",
      "due_date": "2024-12-31T23:59:59.000Z",
      "total_marks": 50,
      "display_result": 1,
      "analysis_status": "not_analysed"
    }
  ]
}
```

---

### Get HR Question Set by ID

Retrieve a specific HR question set with all questions.

**Endpoint**: `GET /api/hr/questions/:id`

**Authentication**: Required

**URL Parameters**:
- `id` (integer): Question set ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "HR Set 1",
    "description": "General HR questions",
    "questions": [
      {
        "id": 1,
        "qno": 1,
        "question": "Tell me about yourself",
        "marks": 10,
        "answer_url": "NA",
        "answer_transcript": "NA"
      }
    ]
  }
}
```

**Errors**:
- 404: Question set not found

---

### Create HR Question Set

Create a new HR question set (Admin only).

**Endpoint**: `POST /api/hr/questions`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "title": "HR Set 2",
  "description": "Advanced HR questions",
  "due_date": "2024-12-31T23:59:59Z",
  "total_marks": 100,
  "display_result": 1,
  "questions": [
    {
      "qno": 1,
      "question": "What are your strengths?",
      "marks": 20
    },
    {
      "qno": 2,
      "question": "Why do you want to work here?",
      "marks": 20
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "HR question set created successfully",
  "questionSetId": 2
}
```

**Errors**:
- 400: Invalid input
- 403: Not authorized (not admin)

---

### Submit HR Answer

Submit an answer to an HR question.

**Endpoint**: `POST /api/hr/submit`

**Authentication**: Required

**Request Body**:
```json
{
  "hr_question_id": 1,
  "qno": 1,
  "answer": "I am a dedicated professional with..."
}
```

**Note**: For video answers, submit the video filename returned from the upload endpoint.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "answerId": 456
}
```

**Errors**:
- 400: Missing required fields
- 404: Question not found
- 409: Answer already submitted

---

## Technical Questions Endpoints

Similar structure to HR Questions:

- `GET /api/technical/questions`
- `GET /api/technical/questions/:id`
- `POST /api/technical/questions` (Admin)
- `POST /api/technical/submit`

---

## Programming Questions Endpoints

Similar structure to HR Questions:

- `GET /api/programming/questions`
- `GET /api/programming/questions/:id`
- `POST /api/programming/questions` (Admin)
- `POST /api/programming/submit`

---

## Quiz Endpoints

### Get All Quizzes

**Endpoint**: `GET /api/quiz/questions`

**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript Basics",
      "description": "Test your JavaScript knowledge",
      "time_limit": 30,
      "total_marks": 100
    }
  ]
}
```

---

### Get Quiz by ID

**Endpoint**: `GET /api/quiz/questions/:id`

**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript Basics",
    "questions": [
      {
        "qno": 1,
        "question": "What is a closure?",
        "option_a": "A function",
        "option_b": "A variable",
        "option_c": "A function with access to outer scope",
        "option_d": "None of the above",
        "correct_option": "C",
        "marks": 10
      }
    ]
  }
}
```

---

### Submit Quiz Answers

**Endpoint**: `POST /api/quiz/submit`

**Authentication**: Required

**Request Body**:
```json
{
  "quiz_id": 1,
  "answers": [
    {
      "qno": 1,
      "selected_option": "C"
    },
    {
      "qno": 2,
      "selected_option": "A"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "score": 80,
  "total_marks": 100,
  "percentage": 80,
  "results": [
    {
      "qno": 1,
      "correct": true,
      "marks_awarded": 10
    },
    {
      "qno": 2,
      "correct": false,
      "marks_awarded": 0
    }
  ]
}
```

---

## Video Interview Endpoints

### Upload Video

Upload a video file.

**Endpoint**: `POST /api/video/upload`

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Request Body**:
- `video` (file): Video file (MP4, AVI, MOV, etc.)

**Response** (200 OK):
```json
{
  "success": true,
  "filename": "video-1234567890123.mp4",
  "url": "http://localhost:5000/videos/video-1234567890123.mp4"
}
```

**Errors**:
- 400: No file uploaded or invalid file type
- 413: File too large (max 100MB)

---

### Get Video Question Sets

**Endpoint**: `GET /api/video/questions`

**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Video Interview Set 1",
      "description": "Behavioral questions",
      "total_marks": 50
    }
  ]
}
```

---

### Submit Video Answer

**Endpoint**: `POST /api/video/submit`

**Authentication**: Required

**Request Body**:
```json
{
  "video_question_id": 1,
  "qno": 1,
  "answer": "video-1234567890123.mp4"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Video answer submitted successfully"
}
```

---

## Evaluation Endpoints

### Batch Evaluate Answers

Trigger AI evaluation for multiple users (Admin only).

**Endpoint**: `POST /api/evaluate/batch`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "type": "hr",
  "setId": 1,
  "userIds": [87, 88, 89]
}
```

**Fields**:
- `type` (string): "hr", "technical", or "programming"
- `setId` (integer): Question set ID
- `userIds` (array): Array of user IDs to evaluate

**Response** (200 OK):
```json
{
  "type": "hr",
  "setId": 1,
  "total": 3,
  "summary": [
    {
      "userId": 87,
      "ok": true,
      "count": 5,
      "results": [
        {
          "qno": 1,
          "marks_awarded": 8,
          "score": 85.5
        }
      ]
    },
    {
      "userId": 88,
      "ok": false,
      "error": "No answers found"
    }
  ]
}
```

**Errors**:
- 400: Invalid type or missing parameters
- 403: Not authorized
- 500: Evaluation failed

---

## Notification Endpoints

### Send Notification

Send push notification to users (Admin only).

**Endpoint**: `POST /api/notifications/send`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "userIds": [87, 88],
  "title": "New Assignment",
  "body": "A new HR quiz is available"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Notifications sent successfully",
  "sent": 2,
  "failed": 0
}
```

---

## Common Workflows

### Student Taking a Quiz

1. Login: `POST /api/auth/login`
2. Get quizzes: `GET /api/quiz/questions`
3. Get quiz details: `GET /api/quiz/questions/:id`
4. Submit answers: `POST /api/quiz/submit`

### Student Submitting Video Interview

1. Login: `POST /api/auth/login`
2. Record video (client-side)
3. Upload video: `POST /api/video/upload`
4. Submit video answer: `POST /api/video/submit` (with filename)

### Admin Creating and Evaluating Quiz

1. Login: `POST /api/auth/login`
2. Create question set: `POST /api/hr/questions`
3. Wait for student submissions
4. Trigger evaluation: `POST /api/evaluate/batch`
5. Send notification: `POST /api/notifications/send`

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Get Quizzes (with token)
```bash
TOKEN="your_jwt_token_here"

curl http://localhost:5000/api/quiz/questions \
  -H "Authorization: Bearer $TOKEN"
```

### Upload Video
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/video/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "video=@/path/to/video.mp4"
```

---

## Testing with Postman

1. **Create Environment**
   - Variable: `baseUrl` = `http://localhost:5000`
   - Variable: `token` = (will be set after login)

2. **Login Request**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/login`
   - Body: JSON with email and password
   - Tests: Set `token` variable from response

3. **Authenticated Requests**
   - Add header: `Authorization: Bearer {{token}}`

---

## Versioning

Current API version: **v1**

Future versions may be accessed via:
```
/api/v2/endpoint
```

---

## Support

For API issues or questions:
- Check this documentation
- Review backend [README](backend/README.md)
- Open an issue on GitHub

---

**Last Updated**: 2024
