import React, { useEffect, useRef, useState } from "react";
import "../App3.css";
import HandDetectionOverlay from "./HandDetectionOverlay";
import { runHandposeDetection } from "./runHandposeDetection";
import { initThreeScene } from "./ThreeScene";


// 📐 Canvas dimensions
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 960;

function HandModelScene() {
    const [emoji, setEmoji] = useState(null);
    const [poseData, setPoseData] = useState([]);

    const threeCanvasRef = useRef(null);
    const detectCanvasRef = useRef(null);

    useEffect(() => {
        const cleanupThree = initThreeScene(threeCanvasRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
        const cleanupTF = runHandposeDetection(threeCanvasRef, detectCanvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, setEmoji,
            setPoseData);

        return () => {
            cleanupThree();
            cleanupTF();
        };
    }, []);

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
                    <canvas ref={threeCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                    <canvas ref={detectCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </div>
                <HandDetectionOverlay emoji={emoji} poseData={poseData} />
            </header>
        </div>
    );
}

export default HandModelScene;
