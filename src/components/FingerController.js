// FingerController.js

export class FingerController {
  constructor(keyToBonesMap) {
    this.keyToBones = keyToBonesMap; // { e: [boneNames] }
    this.rotationState = {}; // { Bone016: 0, Bone017: 0, ... }
    this.keysPressed = new Set();

    window.addEventListener("keydown", (e) => {
      this.keysPressed.add(e.key.toLowerCase());
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
  }

  register(bone) {
    this.rotationState[bone.name] = 0;
  }

  update(bone) {
    const name = bone.name;
    const shouldMove = [...this.keysPressed].some((key) =>
      this.keyToBones[key]?.includes(name)
    );

    if (shouldMove) {
      this.rotationState[name] = Math.min(
        this.rotationState[name] + 0.02,
        Math.PI / 2
      );
    } else {
      this.rotationState[name] = Math.max(this.rotationState[name] - 0.02, 0);
    }

    bone.rotation.z = this.rotationState[name];
  }
}
