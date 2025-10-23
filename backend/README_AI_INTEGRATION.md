# AI Server Integration

This backend connects to the Python AI server under `ai_server/` to transcribe videos and score HR/Technical answers.

## Configure

Set environment variables in `backend/.env`:

AI_SERVER_URL=http://localhost:7860
BACKEND_PUBLIC_BASE=http://localhost:5000

- AI_SERVER_URL — Flask server base URL
- BACKEND_PUBLIC_BASE — Public base URL to access uploaded videos at `/videos/<filename>`

## New endpoint

POST /api/evaluate/batch

Body:

{"type":"hr|technical","setId":123,"userIds":[87,88]}

What it does:
- Fetches answers for each user in the given set
- If an answer looks like a video filename (e.g., video-*.mp4) or a full URL, it transcribes via the AI server
- Otherwise treats the answer as text
- Scores similarity between question text and student transcript/answer using the AI server `/score`
- Scales score (0..100) to question marks and updates `marks_awarded`

Response example:

{"type":"hr","setId":1,"total":2,"summary":[{"userId":87,"ok":true,"count":3,"results":[{"qno":1,"marks_awarded":4,"score":78.5}]},{"userId":88,"ok":false,"error":"No answers found"}]}

## Run locally

1) Start the AI server (in `ai_server/`)
2) Start the backend (in `backend/`)
3) Call the batch API (Authorization required)

Or run the local script (bypasses HTTP/auth):
- node backend/scripts/run-evaluation.js hr 1 87
- node backend/scripts/run-evaluation.js technical 1 87

AI server endpoints used: `/transcribe`, `/evaluate`, and `/score`.