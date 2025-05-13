from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your JS app

@app.route('/api/check', methods=['POST'])
def check_input():
    data = request.json
    text = data.get('text', '')

    print(f"[Server] Received text: '{text}'")  # ✅ print received message

    # Dummy logic
    if text.lower() in ['hello', 'yes', 'ok']:
        result = 'yes'
    else:
        result = 'no'

    print(f"[Server] Sending response: '{result}'")  # ✅ print before sending
    return jsonify({'response': result})

if __name__ == '__main__':
    print("[Server] Flask server starting on http://localhost:5000")  # ✅ print on start
    app.run(host='0.0.0.0', port=5000)
