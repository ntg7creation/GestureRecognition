// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen


import React, { useEffect, useRef, useState } from "react";

import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";

import * as fp from "fingerpose";
import { customGestures } from "./customGestures.js";

import finger_up from "./finger_up.png";
import logo from "./logo.svg";
import thumbs_up from "./thumbs_up.png";
import { drawHand } from "./utilities";
import victory from "./victory.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [emoji, setEmoji] = useState(null);
  const [poseData, setPoseData] = useState([]);

  // const images = {
  //   thumbs_up: thumbs_up,
  //   victory: victory,
  //   finger_up: finger_up,
  // };
  const emojiMap = {
    thumbs_up: "👍",
    victory: "✌️",
    one_finger: "☝️",
    three_fingers: "🤟", // or "🖖" / "3️⃣"
    four_fingers: "🖖", // or "4️⃣"
    five_fingers: "🖐️", // or "5️⃣"
    closed_hand: "✊",
  };

  const getCurlEmojiFromLabel = (curlLabel) => {
    switch (curlLabel) {
      case "No Curl":
        return "🟢";
      case "Half Curl":
        return "🟡";
      case "Full Curl":
        return "🔴";
      default:
        return "❓";
    }
  };

  const getDirectionEmojiFromLabel = (directionLabel) => {
    switch (directionLabel) {
      case "Vertical Up":
        return "⬆️";
      case "Vertical Down":
        return "⬇️";
      case "Horizontal Left":
        return "⬅️";
      case "Horizontal Right":
        return "➡️";
      case "Diagonal Up Left":
        return "↖️";
      case "Diagonal Up Right":
        return "↗️";
      case "Diagonal Down Left":
        return "↙️";
      case "Diagonal Down Right":
        return "↘️";
      default:
        return "❓";
    }
  };

  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);

      // Filter out virtual cameras or specific unwanted labels
      const filtered = videoDevices.filter(
        (d) => !/virtual|redmi/i.test(d.label)
      );
      const preferred = filtered[0] || videoDevices[0]; // fallback
      if (preferred) {
        console.log("Selected camera:", preferred.label);
        setDeviceId(preferred.deviceId);
      } else {
        console.warn("No suitable camera found.");
      }
    });
  }, []);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // console.log("Video is ready");
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // console.log(" Width: ", videoWidth, " Height: ", videoHeight);
      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // console.log("Make Detections");
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.ThumbsUpGesture,
          ...customGestures,
        ]);

        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const top3Scores = gesture.gestures
            .map((prediction, index) => ({
              name: prediction.name,
              confidence: prediction.confidence,
            }))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);

          console.log("GestureEstimator raw output:", gesture.poseData);
          setPoseData(gesture.poseData); // gesture.poseData is your (5) [Array(3), ...]

          // console.log(`Top 3 Scores:
          // 1. ${top3Scores[0].name} - ${top3Scores[0].confidence}
          // 2. ${top3Scores[1].name} - ${top3Scores[1].confidence}
          // 3. ${top3Scores[2].name} - ${top3Scores[2].confidence}`);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);
          // console.log(emoji);
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    } else {
      console.log("Video not ready");
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            deviceId: deviceId ? { exact: deviceId } : undefined,
          }}
          onUserMedia={() => console.log("Webcam initialized")}
          onUserMediaError={(err) => console.error("Webcam error:", err)}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        {/* NEW STUFF */}
        {emoji !== null ? (
          <div
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              fontSize: 100,
              zIndex: 10,
            }}
          >
            {emojiMap[emoji] || "❓"}
          </div>
        ) : null}

        {poseData.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 100,
              right: 20,
              fontSize: 30,
              textAlign: "right",
              zIndex: 10,
              background: "rgba(0,0,0,0.4)",
              padding: 10,
              borderRadius: 8,
            }}
          >
            {poseData.map((finger, i) => (
              <div key={i}>
                {finger[0]}: {getCurlEmojiFromLabel(finger[1])}{" "}
                {getDirectionEmojiFromLabel(finger[2])}
              </div>
            ))}
          </div>
        )}

        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
