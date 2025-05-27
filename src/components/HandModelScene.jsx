import React, { useEffect, useRef, useState } from "react";
import "../App3.css";
import { sendTextAndGetRotationVector } from "./api"; // add this
import HandCanvasContainer from "./HandCanvasContainer";


/* ----------------------------- jsx components ----------------------------- */
import { detectGesture } from "../GestureDetection";
import HandDetectionOverlay from "./HandDetectionOverlay";
import { runHandposeDetection } from "./runHandposeDetection";
import { runMediaPipeDetection } from "./runMediaPipeDetection";
import TextToRotationInput from "./TextToRotationInput";
import { initThreeScene } from "./ThreeScene";

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 960;

function HandModelScene() {
    const [emoji, setEmoji] = useState(null);
    const [landmarkData, setLandmarkData] = useState([]);
    const [dataset, setDataset] = useState([]);
    const [poseData, setPoseData] = useState([]);

    const getCurrentRotationsRef = useRef(null);
    // const webcamRef = useRef(null);
    // const [useWebcam, setUseWebcam] = useState(true); // toggle mode


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
        const cleanupThree = sceneAPI.cleanup;

        const startDetection = async () => {
            // if (useWebcam) {
            //     // Enable webcam
            //     console.log("use webcam")
            //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            //     webcamRef.current.srcObject = stream;
            //     webcamRef.current.onloadeddata = async () => {
            //         const stop = await runMediaPipeDetection(
            //             webcamRef.current,
            //             detectCanvasRef.current,
            //             setEmoji,
            //             setPoseData
            //         );
            //         cleanupTFRef.current = stop;
            //     };
            // } else {
            const stop = await runMediaPipeDetection(
                threeCanvasRef.current,
                detectCanvasRef.current,
                setLandmarkData
            );
            cleanupTFRef.current = stop;
            // }
        };

        const cleanupTFRef = { current: () => { } };
        startDetection();

        return () => {
            cleanupThree();
            cleanupTFRef.current();
        };
    }, []);

    /* ---------------------------- classify gesture ---------------------------- */
    useEffect(() => {
        //TODO not sure we need this if
        if (landmarkData.length === 21) { // 21 landmarks expected

            const clean = landmarkData.map(({ x, y, z }) => ({ x, y, z }));
            detectGesture(clean, setEmoji, setPoseData);
        }
    }, [landmarkData]);

    /* ----------- data saver - saves the data when a gesture changes -  currently off  ----------- */
    useEffect(() => {
        const ON_OFF = false;
        if (!ON_OFF) return;

        if (!emoji || landmarkData.length !== 5) return;

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
    }, [emoji, landmarkData]);

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

                {/* <video
                    ref={webcamRef}
                    style={{ display: useWebcam ? "block" : "none" }}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    autoPlay
                    muted
                    playsInline
                /> */}
                {/* <button onClick={() => setUseWebcam((prev) => !prev)}>
                    {useWebcam ? "Use 3D Model" : "Use Webcam"}
                </button> */}
            </header>
        </div>
  );
}

export default HandModelScene;
