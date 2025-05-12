import * as THREE from "three";
import { TextureLoader } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

let animationId = null;

export function initThreeScene(canvas, width = 640, height = 480) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 2, 2);
  scene.add(light);

  const objLoader = new OBJLoader();
  const textureLoader = new TextureLoader();

  const colorMap = textureLoader.load("/models/arm_base_color.png");
  const roughnessMap = textureLoader.load("/models/arm_roughness.png");
  const normalMap = textureLoader.load("/models/arm_normal.png");

  let model = null;

  objLoader.load("/models/arm3.obj", (object) => {
    console.log(object);
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

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(animationId);
    renderer.dispose();
  };
}
