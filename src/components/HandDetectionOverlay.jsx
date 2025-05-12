// components/HandDetectionOverlay.jsx
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

const getCurlEmoji = (label) => {
    switch (label) {
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

const getDirectionEmoji = (label) => {
    switch (label) {
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

const HandDetectionOverlay = ({ emoji, poseData }) => {
    return (
        <>
            {emoji && (
                <div
                    style={{
                        position: "absolute",
                        left: "95%",
                        transform: "translateX(-50%)",
                        top: 20,
                        fontSize: 80,
                        zIndex: 100,
                    }}
                >
                    {emojiMap[emoji] || "❓"}
                </div>
            )}

            {poseData.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: 150,
                        left: "85%",
                        fontSize: 26,
                        textAlign: "right",
                        zIndex: 100,
                        background: "rgba(0,0,0,0.6)",
                        padding: 10,
                        borderRadius: 8,
                        color: "white",
                    }}
                >
                    {poseData.map((finger, i) => (
                        <div key={i}>
                            {finger[0]}: {getCurlEmoji(finger[1])} {getDirectionEmoji(finger[2])}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default HandDetectionOverlay;
