import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import { detectGesture } from "./GestureDetection";
import { CameraFeed, useCameraStream } from "./StreamIntake";
import { VisualOutput } from "./VisualOutput";

function App() {
  const { webcamRef, deviceId } = useCameraStream();
  const canvasRef = useRef(null);

  const [emoji, setEmoji] = useState(null);
  const [poseData, setPoseData] = useState([]);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detectGesture(net, webcamRef, canvasRef, setEmoji, setPoseData);
    }, 100);
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <CameraFeed webcamRef={webcamRef} deviceId={deviceId} />
        <VisualOutput emoji={emoji} poseData={poseData} canvasRef={canvasRef} />
      </header>
    </div>
  );
}

export default App;
