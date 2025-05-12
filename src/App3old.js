import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import "./App.css";
import { customGestures } from "./customGestures";
import { drawHand } from "./utilities";

function App3() {
  const threeCanvasRef = useRef(null);
  const detectCanvasRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, model, frameId;
    const width = 640;
    const height = 480;

    const initThree = async () => {
      // Set up scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 16;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: threeCanvasRef.current,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, height);

      // Light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 2, 2);
      scene.add(light);

      // Load hand model
      const objLoader = new OBJLoader();
      const textureLoader = new TextureLoader();

      const colorMap = textureLoader.load("/models/arm_base_color.png");
      const roughnessMap = textureLoader.load("/models/arm_roughness.png");
      const normalMap = textureLoader.load("/models/arm_normal.png");

      objLoader.load("/models/arm3.obj", (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: colorMap,
              roughnessMap: roughnessMap,
              normalMap: normalMap,
              roughness: 1,
            });
          }
        });
        model = object;
        model.position.y = -6.1;

        scene.add(model);
      });

      // Animate
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (model) model.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      // Load handpose model
      const net = await handpose.load();
      console.log("Handpose model loaded.");

      // Detect loop
      const detect = async () => {
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
            console.log("Gesture:", top.name);
          }
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    initThree();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="App">
      <canvas
        ref={threeCanvasRef}
        style={{
          border: "2px solid white",
          display: "block",
          margin: "0 auto",
        }}
        width={640}
        height={480}
      />
      <canvas
        ref={detectCanvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
}

export default App3;
