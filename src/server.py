from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json
from threading import Thread
from python.train_model import start_training
# Import your model and queue logic
from python.model import get_rotations
from python.feedback import send_task_to_frontend, get_task_for_frontend, add_detected_gesture

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

@app.route("/api/pending-task", methods=["GET"])
def get_task():
    task = get_task_for_frontend()
    if task is None:
        return jsonify({})
    rotation_vector, label = task
    print("[Server] Task dequeued:", label)
    return jsonify({
        "rotation_vector": rotation_vector,
        "label": label
    })


@app.route("/api/return-gesture", methods=["POST"])
def return_gesture():
    data = request.json
    detected = data.get("detected", None)
    if detected:
        # print("[Server] Got feedback:", json.dumps(detected, indent=2))
        add_detected_gesture(detected)
    return jsonify({"status": "ok"})



@app.route("/api/start-training", methods=["POST"])
def start_training_route():
    Thread(target=start_training).start()  # Run training in the background
    print("[Server] Training started from JS")
    return jsonify({"status": "started"})


if __name__ == "__main__":
    print("[Server] Running on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000)


