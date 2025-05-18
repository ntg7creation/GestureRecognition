// FingerController.js


// Define flexion limits for each joint (in radians)
const jointLimits = {
      Bone013: [0, Math.PI / 2],     // index_MCP ~90°
      Bone014: [0, Math.PI * 0.6],   // index_PIP ~108°
      Bone015: [0, Math.PI * 0.36],  // index_DIP ~65°

      Bone016: [0, Math.PI / 2],     // middle_MCP ~90°
      Bone017: [0, Math.PI * 0.6],   // middle_PIP ~108°
      Bone018: [0, Math.PI * 0.36],  // middle_DIP ~65°

      Bone019: [0, Math.PI / 2],     // ring_MCP ~90°
      Bone020: [0, Math.PI * 0.6],   // ring_PIP ~108°
      Bone021: [0, Math.PI * 0.36],  // ring_DIP ~65°

      Bone022: [0, Math.PI / 2],     // pinky_MCP ~90°
      Bone023: [0, Math.PI * 0.6],   // pinky_PIP ~108°
      Bone024: [0, Math.PI * 0.36],  // pinky_DIP ~65°

      Bone003: [0, Math.PI * 0.28],  // thumb_MCP ~50°
      Bone004: [0, Math.PI * 0.44],  // thumb_IP ~80°
    };

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
    const [min, max] = jointLimits[name] || [0, Math.PI / 2];

    const shouldMove = [...this.keysPressed].some((key) =>
      this.keyToBones[key]?.includes(name)
    );

    if (shouldMove) {
      this.rotationState[name] = Math.min(this.rotationState[name] + 0.02, max);
    } else {
      this.rotationState[name] = Math.max(this.rotationState[name] - 0.02, min);
    }

    bone.rotation.z = this.rotationState[name];
  }
}
