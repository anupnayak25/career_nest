
# AI Server - Video Transcription and Evaluation API

A Flask-based AI server that provides video transcription and transcript evaluation services using OpenAI Whisper and Sentence Transformers.

## Features

- **Video Transcription**: Convert video files to text using OpenAI Whisper
- **Transcript Evaluation**: Compare student responses with expected answers using semantic similarity
- **Video Download**: Download videos from URLs for processing
- **RESTful API**: Simple REST endpoints for easy integration

## Prerequisites

- Python 3.8 or higher
- Virtual environment (recommended)
- ffmpeg (for video processing)

## Installation

### 1. Create and activate a virtual environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Install ffmpeg (if not already installed)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

## Usage

### Running the Server

```bash
python app.py
```

The server will start on `http://0.0.0.0:7860`

### API Endpoints

#### 1. Health Check
```
GET /
```
Returns a welcome message to verify the server is running.

#### 2. Transcribe Video
```
POST /transcribe
```
**Request Body:**
```json
{
  "videoUrl": "https://example.com/video.mp4"
}
```
**Response:**
```json
{
  "transcript": "Transcribed text from the video"
}
```

#### 3. Evaluate Video Against Expected Answer
```
POST /evaluate
```
**Request Body:**
```json
{
  "videoUrl": "https://example.com/student-video.mp4",
  "expectedTranscript": "Expected answer text"
}
```
**Response:**
```json
{
  "transcript": "Student's transcribed response",
  "score": 85.67
}
```

#### 4. Score Text Comparison
```
POST /score
```
**Request Body:**
```json
{
  "expectedTranscript": "Expected answer text",
  "studentTranscript": "Student's response text"
}
```
**Response:**
```json
{
  "score": 85.67
}
```

## Project Structure

```
ai_server/
├── app.py                 # Main Flask application
├── whisper_service.py     # Video transcription service
├── evaluation_service.py  # Transcript evaluation service
├── utils.py              # Utility functions (video download)
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Services Overview

### Whisper Service (`whisper_service.py`)
- Uses OpenAI Whisper "base" model for speech-to-text conversion
- Processes video files and returns transcribed text

### Evaluation Service (`evaluation_service.py`)
- Uses Sentence Transformers (`all-MiniLM-L6-v2` model)
- Calculates semantic similarity between expected and student responses
- Returns similarity score as percentage (0-100)

### Utils (`utils.py`)
- Downloads videos from URLs
- Validates video file format and size
- Handles temporary file management

## Development

### Running in Development Mode

```bash
# With debug mode
export FLASK_ENV=development
python app.py
```

### Production Deployment

The server includes Gunicorn for production deployment:

```bash
gunicorn -w 4 -b 0.0.0.0:7860 app:app
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: Processing errors

## Model Information

- **Whisper Model**: Base model (faster, moderate accuracy)
- **Sentence Transformer**: all-MiniLM-L6-v2 (lightweight, good performance)

## Notes

- Video files are temporarily downloaded and processed locally
- The server supports various video formats that ffmpeg can handle
- Similarity scoring is based on semantic meaning, not exact word matching
- Models are loaded once at startup for better performance

## Contributing

1. Ensure all dependencies are installed
2. Follow Python PEP 8 style guidelines
3. Add appropriate error handling for new features
4. Update this README for any new endpoints or functionality
