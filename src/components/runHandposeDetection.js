import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import { customGestures } from "../customGestures";
import { drawHand } from "../utils/utilities";
import { boneOrder, curlToRotation } from "./rotationMap";

let detectionId = null;

export const runHandposeDetection = (
  threeCanvasRef,
  detectCanvasRef,
  width = 640,
  height = 480,
  setEmoji,
  setPoseData
) => {
  let stop = false;

  const start = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    const detect = async () => {
      if (stop) return;
      const predictions = await net.estimateHands(threeCanvasRef.current);
      const ctx = detectCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      drawHand(predictions, ctx);

      if (predictions.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.ThumbsUpGesture,
          ...customGestures,
        ]);
        const gesture = await GE.estimate(predictions[0].landmarks, 4);
        if (gesture.gestures?.length > 0) {
          const top = gesture.gestures.reduce((a, b) =>
            a.confidence > b.confidence ? a : b
          );
          // console.log("Gesture:", top.name);
          setEmoji(top.name);
          setPoseData(gesture.poseData);

          // Generate rotation vector from poseData
          const rotation_vector = gesture.poseData.map((finger) => {
            const curlLabel = finger[1]; // e.g. "Full Curl"
            return curlToRotation[curlLabel] ?? 0;
          });

          // Build training sample
          const snapshot = {
            gesture: top.name,
            rotation_vector,
          };
          // console.log("Posedata:", gesture.poseData);
          // console.log("Snapshot:", JSON.stringify(snapshot));
        }
      } else {
        // console.log("No hand detected");
      }

      detectionId = requestAnimationFrame(detect);
    };

    detect();
  };

  start();

  return () => {
    stop = true;
    cancelAnimationFrame(detectionId);
  };
};
