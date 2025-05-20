import React, { useEffect, useRef, useState } from "react";
import "../App3.css";
import { sendTextToServer } from "./api";
import HandDetectionOverlay from "./HandDetectionOverlay";
import { curlToRotation } from "./rotationMap";
import { runHandposeDetection } from "./runHandposeDetection";
import { initThreeScene } from "./ThreeScene";

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 960;

function HandModelScene() {
    const [emoji, setEmoji] = useState(null);
    const [poseData, setPoseData] = useState([]);
    const [dataset, setDataset] = useState([]);

    const getCurrentRotationsRef = useRef(null);


    // 🆕 Save and send only when gesture changes
    const lastGestureRef = useRef(null);
    const gestureTimer = useRef(null);

    const threeCanvasRef = useRef(null);
    const detectCanvasRef = useRef(null);

    let getCurrentRotations = null;

    useEffect(() => {
        const { cleanup, getCurrentRotations: getRot } = initThreeScene(
            threeCanvasRef.current,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );

        getCurrentRotationsRef.current = getRot;

        const cleanupTF = runHandposeDetection(
            threeCanvasRef,
            detectCanvasRef,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            setEmoji,
            setPoseData
        );

        return () => {
            cleanup();
            cleanupTF();
        };
    }, []);


    useEffect(() => {
        if (!emoji || poseData.length !== 5) return;

        if (emoji !== lastGestureRef.current) {
            // New gesture started — reset timer
            lastGestureRef.current = emoji;

            if (gestureTimer.current) clearTimeout(gestureTimer.current);

            gestureTimer.current = setTimeout(() => {
                // ✅ Stable gesture for 500ms → save and send
                const rotation_vector = getCurrentRotationsRef.current
                    ? getCurrentRotationsRef.current()
                    : [];



                const sample = {
                    gesture: emoji,
                    rotation_vector,
                };

                setDataset((prev) => [...prev, sample]);
                console.log("Stable sample saved:", sample);

                sendTextToServer(emoji).then((response) => {
                    // console.log("Server replied:", response);
                });
            }, 500); // <-- wait 500ms before saving
        }
    }, [emoji, poseData]);

    // 🔽 Press 'd' to download dataset
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "d") {
                const blob = new Blob([JSON.stringify(dataset, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "gesture_dataset.json";
                a.click();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [dataset]);

    return (
        <div className="App3">
            <header className="App3-header">
                <div className="canvas-container" style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}>
                    <canvas ref={threeCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                    <canvas ref={detectCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                        style={{ position: "absolute", top: 0, left: 0, zIndex: 10, pointerEvents: "none" }}
                  />
              </div>
              <HandDetectionOverlay emoji={emoji} poseData={poseData} />
          </header>
      </div>
  );
}

export default HandModelScene;
