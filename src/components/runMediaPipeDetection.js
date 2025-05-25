// runMediaPipeDetection.js
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

let detector = null;
let animationId = null;

function drawLandmarksSimple(ctx, landmarks, color = "#FF0000") {
  ctx.fillStyle = color;
  for (const { x, y } of landmarks) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export const runMediaPipeDetection = async (
  inputElement,
  canvasElement,
  setEmoji,
  setPoseData
) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  detector = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 1,
  });

  const ctx = canvasElement.getContext("2d");

  const detect = async () => {
    const now = performance.now();
    const results = await detector.detectForVideo(inputElement, now);

    canvasElement.width = inputElement.videoWidth || inputElement.width;
    canvasElement.height = inputElement.videoHeight || inputElement.height;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks && results.landmarks.length > 0) {
      for (const lm of results.landmarks) {
        const scaled = lm.map((pt) => ({
          x: pt.x * canvasElement.width,
          y: pt.y * canvasElement.height,
        }));
        drawLandmarksSimple(ctx, scaled);
      }

      setEmoji("🖐️");
      setPoseData([]);
    }

    animationId = requestAnimationFrame(detect);
  };

  detect();

  return () => cancelAnimationFrame(animationId);
};
