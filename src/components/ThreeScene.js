import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AIController } from "./AIController";

import { FingerController } from "./FingerController";

let animationId = null;
let modelRoot = null;
let aiController = null;
let fingerController = null;
let controlledBones = [];

const trackedBoneNames = [
  "Bone002",
  "Bone003",
  "Bone004", // Thumb
  "Bone013",
  "Bone014",
  "Bone015", // Index
  "Bone016",
  "Bone017",
  "Bone018", // Middle
  "Bone019",
  "Bone020",
  "Bone021", // Ring
  "Bone022",
  "Bone023",
  "Bone024", // Pinky
];

export function initThreeScene(canvas, width, height) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  /* --------------------------- add orbit controls --------------------------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  /* ------------------------------- add lights ------------------------------- */
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 2, 2);
  scene.add(light);

  const backLight = new THREE.DirectionalLight(0xffcccc, 0.5);
  backLight.position.set(-2, -1, -3);
  scene.add(backLight);

  /* -------------------------- add finger controllers ------------------------ */
const fingerKeyMap = {
  // down
  q: ["Bone022", "Bone023", "Bone024"],
  w: ["Bone019", "Bone020", "Bone021"],
  e: ["Bone016", "Bone017", "Bone018"],
  r: ["Bone013", "Bone014", "Bone015"],
  g: ["Bone003", "Bone004"],

  // up
  a: ["Bone022", "Bone023", "Bone024"],
  s: ["Bone019", "Bone020", "Bone021"],
  d: ["Bone016", "Bone017", "Bone018"],
  f: ["Bone013", "Bone014", "Bone015"],
  b: ["Bone003", "Bone004"],
};

/* -------------------------------- Load Mesh ------------------------------- */
const loader = new GLTFLoader();
loader.load(
  "/models/Arm3.glb",
  (gltf) => {
    console.log("GLB loaded");
    const model = gltf.scene;
    // model.traverse((child) => {
    //   if (child.isMesh) {
    //     console.log("Mesh:", child.name, "Material:", child.material);
    //     if (child.material.map) {
    //       console.log("Texture map:", child.material.map);
    //     } else {
    //       console.warn("No texture map on", child.name);
    //     }
    //   }
    // });

    modelRoot = model;
    modelRoot.position.y = -6.5;
    model.rotation.y = (Math.PI * 6.2) / 4;

    const skinnedMesh = model.getObjectByProperty("type", "SkinnedMesh");
    if (!skinnedMesh) {
      console.warn("SkinnedMesh not found in GLB");
    }

    // console.log(skinnedMesh);
    const skeleton = skinnedMesh?.skeleton;
    // console.log(skeleton);
    if (skeleton) {
      // Register bones for keyboard and AI control
      const boneRefs = trackedBoneNames.map((name) =>
        skeleton.getBoneByName(name)
      );
      aiController = new AIController(boneRefs);

      fingerController = new FingerController(fingerKeyMap, boneRefs);
      // console.log(fingerController);
    }

    scene.add(model);
  },
  undefined,
  (error) => console.error("GLB load error:", error)
);

/* ---------------------------- Animate function ---------------------------- */
const animate = () => {
  animationId = requestAnimationFrame(animate);

  if (aiController) {
    // aiController.update(); // smooth AI-controlled rotation
  }
  if (fingerController) {
    // console.log("test");
    fingerController.update();
  }
  controls.update();
  renderer.render(scene, camera);
};

  animate();

  return {
    cleanup: () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    },
    setRotationVector: (vec) => {
      if (aiController) aiController.setTarget(vec);
    },
  };
}
