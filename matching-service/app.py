from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load model once when Flask starts (takes ~10 seconds first time)
# Downloads automatically on first run (~90MB)
print("Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model ready!")

@app.route('/similarity', methods=['POST'])
def get_similarity():
    try:
        data = request.get_json()

        resume_text = data.get('resumeText', '')
        job_text = data.get('jobText', '')

        if not resume_text or not job_text:
            return jsonify({'error': 'resumeText and jobText are required'}), 400

        # Convert both texts to vectors
        embeddings = model.encode([resume_text, job_text])

        # Calculate cosine similarity → gives value between 0 and 1
        score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]

        # Convert to percentage rounded to 2 decimal places
        percentage = round(float(score) * 100, 2)

        return jsonify({'score': percentage})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Health check endpoint — Spring Boot can ping this to verify Flask is running
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(port=5000, debug=True)