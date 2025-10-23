const axios = require('axios');

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:7860';

const client = axios.create({
  baseURL: AI_SERVER_URL,
  timeout: 120000, // 120s for transcription
});

async function ping() {
  const res = await client.get('/');
  return res.data;
}

async function transcribe(videoUrl) {
  const res = await client.post('/transcribe', { videoUrl });
  return res.data; // { transcript }
}

async function evaluate(videoUrl, expectedTranscript) {
  const res = await client.post('/evaluate', { videoUrl, expectedTranscript });
  return res.data; // { transcript, score }
}

async function score(expectedTranscript, studentTranscript) {
  const res = await client.post('/score', { expectedTranscript, studentTranscript });
  return res.data; // { score }
}

module.exports = {
  ping,
  transcribe,
  evaluate,
  score,
  AI_SERVER_URL,
};
