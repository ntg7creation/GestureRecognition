# 🖐️ 3D Hand Gesture Recognition and Control

This project integrates a 3D hand model rendered in Three.js with real-time hand gesture recognition using TensorFlow.js. Users can visualize hand gestures, control individual fingers using the keyboard, and send gesture labels to a Python Flask backend server.

---

## 🔧 Features

- 🧠 Real-time hand gesture detection using **@tensorflow-models/handpose** and **fingerpose**
- ✋ Live overlay with emoji & finger pose information
- 🎮 Keyboard-based control of 3D hand fingers (Q/W/E/R/G keys)
- 📦 3D hand model (`GLB`) rendered with **Three.js** and **OrbitControls**
- 🔁 Communication with a Flask API for gesture validation

---

## 📁 Project Structure

```
client/
  ├── App3.js              # Main React entry point
  ├── components/
  │   ├── HandModelScene.jsx
  │   ├── HandDetectionOverlay.jsx
  │   ├── ThreeScene.js
  │   ├── runHandposeDetection.js
  │   ├── FingerController.js
  │   ├── VisualOutput.js
  │   ├── customGestures.js
  │   ├── utilities.js
  │   └── api.js           # Communicates with Flask backend
  ├── App3.css             # Styling
  └── index.js             # Entry point with <App3 />
server/
  ├── server.py            # Flask server
  └── requirements.txt     # Backend dependencies
```

---

## 🚀 How to Run

### 1. Clone & Install

<<<<<<< HEAD
```
git clone https://github.com/ntg7creation/GestureRecognition/tree/python_server
cd your-repo
=======
>>>>>>> origin/python_server
```
git clone https://github.com/ntg7creation/GestureRecognition/tree/python_server
cd your-repo
```bash

bash

### 2. Install Frontend

```bash
cd client
npm install
```

### 3. Install Backend

```bash
cd server
pip install -r requirements.txt
```

---

### 4. Start Flask Server

```bash
cd server
python server.py
```

Server will start at `http://localhost:5000`

---

### 5. Start React Frontend

```bash
cd client
npm start
```

App runs at `http://localhost:3000`

---

## 🖱️ Controls

- `Q` – pinky
- `W` – ring
- `E` – middle
- `R` – index
- `G` – thumb

Hold keys to flex fingers on the 3D hand model.

---

## ✨ Gesture Set

The system recognizes these gestures:

| Gesture Name  | Emoji | Description                     |
|---------------|-------|---------------------------------|
| `thumbs_up`   | 👍    | Only thumb extended             |
| `victory`     | ✌️    | Index and middle extended       |
| `one_finger`  | ☝️    | Only index extended             |
| `three_fingers` | 🤟 | Index, middle, and ring extended |
| `four_fingers` | 🖖   | All except thumb extended       |
| `closed_hand` | ✊    | All fingers curled              |

---

## 🧠 Tech Stack

- **React + Three.js** – front-end & 3D rendering
- **TensorFlow.js + fingerpose** – hand pose detection
- **Flask** – back-end API server

---

## 🛠️ Future Improvements

- Add custom gestures via UI
- Integrate with VR/AR input devices
- Improve finger animation blending
- Use real camera instead of 3D render as input

---

## 📜 License

This project is licensed under the MIT License.---

### 🙏 Credits

- Gesture recognition base implementation adapted from [NickNochnack's Gesture Recognition repository](https://github.com/nicknochnack/GestureRecognition)
- 3D hand model by [TurboSquid: Low Poly Man Hand (3D Model)](https://www.turbosquid.com/3d-models/3d-low-poly-man-hand-2180828)