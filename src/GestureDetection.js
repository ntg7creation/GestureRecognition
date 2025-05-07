// GestureDetection.js
import * as fp from "fingerpose";
import { customGestures } from "./customGestures";
import { drawHand } from "./utilities";

export const detectGesture = async (
  net,
  webcamRef,
  canvasRef,
  setEmoji,
  setPoseData
) => {
  if (webcamRef.current?.video?.readyState === 4) {
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const hand = await net.estimateHands(video);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawHand(hand, ctx);

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
        setEmoji(topGesture.name);
        setPoseData(gesture.poseData);
      }
    }
  }
};
