// FingerController.js

const jointLimits = {
  Bone013: [0, Math.PI / 2],
  Bone014: [0, Math.PI * 0.6],
  Bone015: [0, Math.PI * 0.36],

  Bone016: [0, Math.PI / 2],
  Bone017: [0, Math.PI * 0.6],
  Bone018: [0, Math.PI * 0.36],

  Bone019: [0, Math.PI / 2],
  Bone020: [0, Math.PI * 0.6],
  Bone021: [0, Math.PI * 0.36],

  Bone022: [0, Math.PI / 2],
  Bone023: [0, Math.PI * 0.6],
  Bone024: [0, Math.PI * 0.36],

  Bone003: [0, Math.PI * 0.28],
  Bone004: [0, Math.PI * 0.44],
};

export class FingerController {
  constructor(keyToBonesMap, boneRefs) {
    this.keyToBones = keyToBonesMap; // { e: [boneNames] }
    this.boneRefs = boneRefs; // Array of THREE.Bone
    this.rotationState = {}; // { boneName: currentRotation }
    this.bonesByName = {};

    for (const bone of boneRefs) {
      this.rotationState[bone.name] = 0;
      this.bonesByName[bone.name] = bone;
    }

    this.keysPressed = new Set();

    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed.add(key);
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed.delete(key);
    });
  }

  update() {
    for (const name in this.rotationState) {
      const bone = this.bonesByName[name];
      const [min, max] = jointLimits[name] || [0, Math.PI / 2];


      const downKeys = [...this.keysPressed].filter(
  (key) => this.keyToBones[key]?.includes(name) && "qwertg".includes(key)
);
const upKeys = [...this.keysPressed].filter(
  (key) => this.keyToBones[key]?.includes(name) && "asdfb".includes(key)
);


      if (downKeys.length > 0) {
        this.rotationState[name] = Math.min(
          this.rotationState[name] + 0.02,
          max
        );
      } else if (upKeys.length > 0) {
        this.rotationState[name] = Math.max(
          this.rotationState[name] - 0.02,
          min
        );
      }

      bone.rotation.z = this.rotationState[name];
    }
  }
}
