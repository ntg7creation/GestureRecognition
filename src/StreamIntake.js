// StreamIntake.js
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export const useCameraStream = () => {
  const webcamRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);

      // Filter out virtual cameras or specific unwanted labels
      const filtered = videoDevices.filter(
        (d) => !/virtual|redmi/i.test(d.label)
      );
      const preferred = filtered[0] || videoDevices[0]; // fallback
      if (preferred) {
        console.log("Selected camera:", preferred.label);
        setDeviceId(preferred.deviceId);
      } else {
        console.warn("No suitable camera found.");
      }
    });
  }, []);

  return { webcamRef, deviceId };
};

export const CameraFeed = ({ webcamRef, deviceId }) => (
  <Webcam
    ref={webcamRef}
    audio={false}
    videoConstraints={{
      deviceId: deviceId ? { exact: deviceId } : undefined,
    }}
    onUserMedia={() => console.log("Webcam initialized")}
    onUserMediaError={(err) => console.error("Webcam error:", err)}
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
);
