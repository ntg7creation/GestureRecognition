// GestureDetection.js
import * as fp from "fingerpose";
import { customGestures } from "./customGestures";

// Setup fingerpose with both builtin and custom gestures
const gestureEstimator = new fp.GestureEstimator([
  fp.Gestures.ThumbsUpGesture,
  ...customGestures,
]);

export function detectGesture(landmarks, setEmoji, setPoseData) {
  const result = gestureEstimator.estimate(landmarks, 9); // confidence threshold

  if (result.gestures?.length > 0) {
    const best = result.gestures.reduce((p, c) => (p.score > c.score ? p : c));
    setEmoji(best.name);
  } else {
    setEmoji(null);
  }

  // ➕ Extract and format per-finger curl + direction data
  if (result.poseData?.length === 5) {
    // const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
    // console.log(result.poseData);

    setPoseData(result.poseData);
  } else {
    setPoseData([]);
  }
}
