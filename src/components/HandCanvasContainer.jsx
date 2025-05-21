// components/HandCanvasContainer.jsx
import React from "react";

const HandCanvasContainer = ({ threeCanvasRef, detectCanvasRef, width, height }) => {
    return (
        <div
            className="canvas-container"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            <canvas ref={threeCanvasRef} width={width} height={height} />
            <canvas
                ref={detectCanvasRef}
                width={width}
                height={height}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

export default HandCanvasContainer;
