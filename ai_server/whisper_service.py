import whisper

# Load Whisper model once
model = whisper.load_model("base")  # You can use "small", "medium", "large" if you want

def transcribe_video(video_path):
    result = model.transcribe(video_path)
    return result['text']
