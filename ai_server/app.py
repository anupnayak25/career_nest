from flask import Flask, request, jsonify
from whisper_service import transcribe_video
from evaluation_service import evaluate_transcript
import utils

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Video Transcription and Evaluation API!-- Its just a server for now"})           

@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.json
    video_url = data.get('videoUrl')

    if not video_url:
        return jsonify({"error": "Missing videoUrl"}), 400

    local_video_path = utils.download_video(video_url)
    transcript = transcribe_video(local_video_path)

    return jsonify({
        "transcript": transcript
    })


@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    video_url = data.get('videoUrl')
    expected_transcript = data.get('expectedTranscript')

    if not video_url or not expected_transcript:
        return jsonify({"error": "Missing videoUrl or expectedTranscript"}), 400

    local_video_path = utils.download_video(video_url)
    student_transcript = transcribe_video(local_video_path)

    score = evaluate_transcript(expected_transcript, student_transcript)

    return jsonify({
        "transcript": student_transcript,
        "score": score
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)
