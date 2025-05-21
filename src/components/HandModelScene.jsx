import React, { useEffect, useRef, useState } from "react";
import "../App3.css";
import { sendTextAndGetRotationVector } from "./api"; // add this
import HandCanvasContainer from "./HandCanvasContainer";


/* ----------------------------- jsx components ----------------------------- */
import HandDetectionOverlay from "./HandDetectionOverlay";
import TextToRotationInput from "./TextToRotationInput";

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

    const threeSceneRef = useRef(null);  // 🆕 store API returned from initThreeScene


    let getCurrentRotations = null;

    const [inputText, setInputText] = useState(""); // the textbox in the web
    const [response, setResponse] = useState(null);


    /* --------------------------- talking with server -------------------------- */
    const handleSubmit = async () => {
        if (!inputText.trim()) return;

        const vec = await sendTextAndGetRotationVector(inputText);

        setResponse(vec);

        if (threeSceneRef.current && Array.isArray(vec)) {
            threeSceneRef.current.setRotationVector(vec);
        }
    };


    /* ------------------------------- Init scene ------------------------------- */
    useEffect(() => {
        const sceneAPI = initThreeScene(
            threeCanvasRef.current,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );

        threeSceneRef.current = sceneAPI;

        const cleanup = sceneAPI.cleanup;
        const getRot = sceneAPI.getCurrentRotations;

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

    /* ----------- data saver - saves the data when a gesture changes -  currently off  ----------- */
    useEffect(() => {
        const ON_OFF = false;
        if (!ON_OFF) return;

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

                // sendTextToServer(emoji).then((response) => {
                //     // console.log("Server replied:", response);
                // });
            }, 500); // <-- wait 500ms before saving
        }
    }, [emoji, poseData]);

    /* -------------------- 🔽 Press 'd' to download dataset - currently off -------------------- */
    useEffect(() => {
        const ON_OFF = false;
        if (!ON_OFF) return;
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
                <HandCanvasContainer
                    threeCanvasRef={threeCanvasRef}
                    detectCanvasRef={detectCanvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                />

                <HandDetectionOverlay emoji={emoji} poseData={poseData} />

                <TextToRotationInput
                    inputText={inputText}
                    setInputText={setInputText}
                    onSubmit={handleSubmit}
                    response={response}
                />


            </header>
        </div>
  );
}

export default HandModelScene;
