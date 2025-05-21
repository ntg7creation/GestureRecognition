// useTextPrediction.js
import { useState } from "react";

export function useTextPrediction(threeSceneRef) {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();
      const vec = data.response;
      setResponse(vec);

      if (threeSceneRef.current && Array.isArray(vec)) {
        threeSceneRef.current.setRotationVector(vec);
      }
    } catch (err) {
      console.error("Server error:", err);
      setResponse("Error");
    }
  };

  return {
    inputText,
    setInputText,
    response,
    handleSubmit,
  };
}
