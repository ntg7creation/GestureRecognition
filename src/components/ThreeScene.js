import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FingerController } from "./FingerController"; // <== external control

let animationId = null;
let modelRoot = null;

const boneMap = {
  Bone: "wrist",
  Bone001: "palm_center",
  Bone026: "forearm_root",

  // 🟥 Thumb
  Bone002: "thumb_metacarpal",
  Bone003: "thumb_proximal",
  Bone004: "thumb_distal",

  // 🟩 Index
  Bone013: "index_MCP",
  Bone014: "index_pip",
  Bone015: "index_dip",

  // 🟦 Middle
  Bone016: "middle_MCP",
  Bone017: "middle_pip",
  Bone018: "middle_dip",

  // 🟨 Ring
  Bone019: "ring_MCP",
  Bone020: "ring_pip",
  Bone021: "ring_dip",

  // 🟪 Pinky
  Bone022: "pinky_MCP",
  Bone023: "pinky_pip",
  Bone024: "pinky_dip",

  // 🟦 Palm & helpers
  Bone005: "palm_knuckle",
  Bone006: "palm_knuckle",
  Bone007: "palm_knuckle",
  Bone008: "palm_knuckle",
  Bone009: "palm_paw",
  Bone010: "palm_paw",
  Bone011: "palm_paw",
  Bone012: "palm_paw",
  Bone025: "palm_helper",
};

const animateBones = [];

export function initThreeScene(canvas, width, height) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 2, 2);
  scene.add(light);

  const backLight = new THREE.DirectionalLight(0xffcccc, 0.5);
  backLight.position.set(-2, -1, -3);
  scene.add(backLight);

  const fingerKeys = {
    q: ["Bone022", "Bone023", "Bone024"], // pinky
    w: ["Bone019", "Bone020", "Bone021"], // ring
    r: ["Bone013", "Bone014", "Bone015"], // index
    e: ["Bone016", "Bone017", "Bone018"], // middle
    g: ["Bone003", "Bone004"], // thumb
  };

  const fingerController = new FingerController(fingerKeys);

  const loader = new GLTFLoader();
  loader.load(
    "/models/Arm3.glb",
    (gltf) => {
      console.log("GLB loaded");
      const model = gltf.scene;
      modelRoot = model;
      modelRoot.position.y = -6.5;
      model.rotation.y = (Math.PI * 3) / 4;

      const skinnedMesh = model.getObjectByProperty("type", "SkinnedMesh");
      const skeleton = skinnedMesh?.skeleton;

      if (skeleton) {
        Object.values(fingerKeys)
          .flat()
          .forEach((boneName) => {
            const bone = skeleton.getBoneByName(boneName);
            if (bone) {
              animateBones.push(bone);
              fingerController.register(bone);
            }
          });
      }

      scene.add(model);
    },
    undefined,
    (error) => console.error("GLB load error:", error)
  );

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    animateBones.forEach((bone) => {
      fingerController.update(bone);
    });

    controls.update();
    renderer.render(scene, camera);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationId);
    renderer.dispose();
  };
}
