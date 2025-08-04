from sentence_transformers import SentenceTransformer, util

# Load Hugging Face Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate_transcript(expected, student):
    embeddings = model.encode([expected, student])
    similarity = util.cos_sim(embeddings[0], embeddings[1]).item()

    # Convert similarity (0 to 1) to marks out of 10
    marks = similarity * 10
    return round(marks, 2)
