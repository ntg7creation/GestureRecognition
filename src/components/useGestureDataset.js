// useGestureDataset.js
import { useEffect, useRef, useState } from "react";

export function useGestureDataset(emoji, poseData, getCurrentRotationsRef) {
  const [dataset, setDataset] = useState([]);
  const lastGestureRef = useRef(null);
  const gestureTimer = useRef(null);

  useEffect(() => {
    if (!emoji || poseData.length !== 5) return;

    if (emoji !== lastGestureRef.current) {
      lastGestureRef.current = emoji;
      if (gestureTimer.current) clearTimeout(gestureTimer.current);

      gestureTimer.current = setTimeout(() => {
        const rotation_vector = getCurrentRotationsRef.current?.() || [];

        const sample = { gesture: emoji, rotation_vector };
        setDataset((prev) => [...prev, sample]);
        console.log("Stable sample saved:", sample);
      }, 500);
    }
  }, [emoji, poseData, getCurrentRotationsRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dataset]);

  return dataset;
}
