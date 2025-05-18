import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import React, { useEffect, useRef, useState } from "react";

import { customGestures } from "../customGestures";
import { drawHand } from "../utils/utilities";
import "./App.css";

function App2() {
  const canvasRef = useRef(null); // Main canvas shown to user
  const hiddenCanvasRef = useRef(null); // For brightness processing
  const imageRef = useRef(null); // Original loaded image

  const [brightness, setBrightness] = useState(1); // 1 = 100%
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/Photos/Colour_img_6.jpg";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    let stop = false;
    let net;

    const runDetectionLoop = async () => {
      net = await handpose.load();
      console.log("Handpose model loaded.");

      const detect = async () => {
        if (stop || !imageRef.current) return;

        const img = imageRef.current;
        const canvas = canvasRef.current;
        const hidden = hiddenCanvasRef.current;
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        canvas.width = width;
        canvas.height = height;
        hidden.width = width;
        hidden.height = height;

        const hctx = hidden.getContext("2d");
        const dctx = canvas.getContext("2d");

        // Draw raw image to hidden canvas
        hctx.clearRect(0, 0, width, height);
        hctx.drawImage(img, 0, 0, width, height);

        // Get image data and apply brightness
        const imageData = hctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] *= brightness; // R
          data[i + 1] *= brightness; // G
          data[i + 2] *= brightness; // B
          // A stays the same
        }
        hctx.putImageData(imageData, 0, 0);

        // Copy processed image to visible canvas
        dctx.clearRect(0, 0, width, height);
        dctx.drawImage(hidden, 0, 0);

        // Estimate hands from processed image
        const hand = await net.estimateHands(hidden);
        drawHand(hand, dctx);

        if (hand.length > 0) {
          const GE = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture,
            ...customGestures,
          ]);
          const gesture = await GE.estimate(hand[0].landmarks, 4);
          if (gesture.gestures?.length > 0) {
            const topGesture = gesture.gestures.reduce((p, c) =>
              p.confidence > c.confidence ? p : c
            );
            console.log("Gesture:", topGesture.name);
          }
        }

        requestAnimationFrame(detect); // Loop
      };

      detect();
    };

    runDetectionLoop();

    return () => {
      stop = true;
    };
  }, [brightness, imageLoaded]);

  return (
    <div className="App">
      {/* Brightness Slider */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20 }}>
        <label style={{ color: "white", fontWeight: "bold" }}>
          Brightness: {Math.round(brightness * 100)}%
        </label>
        <input
          type="range"
          min="0.2"
          max="2"
          step="0.05"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
          style={{ width: 200 }}
        />
      </div>

      {/* Canvas that displays image + landmarks */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          border: "2px solid white",
        }}
      />

      {/* Hidden canvas for processing */}
      <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App2;
