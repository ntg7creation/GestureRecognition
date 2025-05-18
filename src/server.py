from flask import Flask, request, jsonify
from flask_cors import CORS
from python.model import get_rotations  # ⬅️ import your model logic

app = Flask(__name__)
CORS(app)

@app.route("/api/check", methods=["POST"])
def check_input():
    data = request.json
    text = data.get("text", "")
    print(f"[Server] Received text: {text}")

    rotations = get_rotations(text)
    print("[Server] Sending rotations:", rotations)
    return jsonify({"response": rotations})

if __name__ == "__main__":
    print("[Server] Flask server starting on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000)
