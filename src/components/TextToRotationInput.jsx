// components/TextToRotationInput.jsx
import React from "react";

const TextToRotationInput = ({
    inputText,
    setInputText,
    onSubmit,
    response,
}) => {
    return (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
            <input
                type="text"
                placeholder="Enter gesture name (e.g. 'thumbs_up')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                }}
                style={{ width: "300px", padding: "8px", fontSize: "16px" }}
            />
            <button onClick={onSubmit} style={{ marginLeft: "10px", padding: "8px 12px" }}>
                Predict
            </button>
            {response && (
                <div style={{ marginTop: "10px", color: "#0f0" }}>
                    Rotation Vector:
                    <pre
                        style={{
                            textAlign: "left",
                            fontSize: "14px",
                            color: "white",
                            background: "#222",
                            padding: "10px",
                        }}
                    >
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TextToRotationInput;
