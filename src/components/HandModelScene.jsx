import React, { useEffect, useRef, useState } from "react";
import "../App3.css";
import { sendTextToServer } from "./api"; // 🔁 Added import
import HandDetectionOverlay from "./HandDetectionOverlay";
import { runHandposeDetection } from "./runHandposeDetection";
import { initThreeScene } from "./ThreeScene";

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 960;

function HandModelScene() {
    const [emoji, setEmoji] = useState(null);
    const [poseData, setPoseData] = useState([]);

    const threeCanvasRef = useRef(null);
    const detectCanvasRef = useRef(null);

    useEffect(() => {
      const cleanupThree = initThreeScene(
          threeCanvasRef.current,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
      );

      const cleanupTF = runHandposeDetection(
          threeCanvasRef,
          detectCanvasRef,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          setEmoji,
          setPoseData
      );

      return () => {
          cleanupThree();
          cleanupTF();
      };
  }, []);

    // 🔁 Send emoji to server ONLY when it changes
    useEffect(() => {
        if (!emoji) return;
        sendTextToServer(emoji).then((response) => {
            console.log("Python server replied:", response);
        });
    }, [emoji]);

    return (
        <div className="App3">
            <header className="App3-header">
                <div
                    className="canvas-container"
                    style={{
                        width: `${CANVAS_WIDTH}px`,
                        height: `${CANVAS_HEIGHT}px`,
                    }}
                >
                  <canvas
                      ref={threeCanvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                  />
                  <canvas
                      ref={detectCanvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 10,
                          pointerEvents: "none",
                      }}
                  />
              </div>
              <HandDetectionOverlay emoji={emoji} poseData={poseData} />
          </header>
      </div>
  );
}

export default HandModelScene;
