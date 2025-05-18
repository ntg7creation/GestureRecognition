// VisualOutput.js
import React from "react";

const emojiMap = {
  thumbs_up: "👍",
  victory: "✌️",
  one_finger: "☝️",
  three_fingers: "🤟",
  four_fingers: "🖖",
  five_fingers: "🖐️",
  closed_hand: "✊",
};

const getCurlEmojiFromLabel = (curlLabel) => {
  switch (curlLabel) {
    case "No Curl":
      return "🟢";
    case "Half Curl":
      return "🟡";
    case "Full Curl":
      return "🔴";
    default:
      return "❓";
  }
};

const getDirectionEmojiFromLabel = (directionLabel) => {
  switch (directionLabel) {
    case "Vertical Up":
      return "⬆️";
    case "Vertical Down":
      return "⬇️";
    case "Horizontal Left":
      return "⬅️";
    case "Horizontal Right":
      return "➡️";
    case "Diagonal Up Left":
      return "↖️";
    case "Diagonal Up Right":
      return "↗️";
    case "Diagonal Down Left":
      return "↙️";
    case "Diagonal Down Right":
      return "↘️";
    default:
      return "❓";
  }
};

export const VisualOutput = ({ emoji, poseData, canvasRef }) => (
  <>
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 640,
        height: 480,
      }}
    />

    {emoji && (
      <div
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 400,
          bottom: 500,
          right: 0,
          textAlign: "center",
          fontSize: 100,
          zIndex: 10,
        }}
      >
        {emojiMap[emoji] || "❓"}
      </div>
    )}

    {poseData.length > 0 && (
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 20,
          fontSize: 30,
          textAlign: "right",
          zIndex: 10,
          background: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 8,
        }}
      >
        {poseData.map((finger, i) => (
          <div key={i}>
            {finger[0]}: {getCurlEmojiFromLabel(finger[1])}{" "}
            {getDirectionEmojiFromLabel(finger[2])}
          </div>
        ))}
      </div>
    )}
  </>
);
