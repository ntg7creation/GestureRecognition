export class AIController {
  constructor(boneList) {
    this.boneRefs = boneList; // ordered list of THREE.Bone
    this.targetRotations = new Array(boneList.length).fill(0);
    this.speed = 0.1; // interpolation factor (can tune)
  }

  update() {
    this.boneRefs.forEach((bone, i) => {
      const current = bone.rotation.z;
      const target = this.targetRotations[i];
      bone.rotation.z += (target - current) * this.speed;
    });
  }

  setTarget(rotVec) {
    if (rotVec.length !== this.boneRefs.length) {
      console.warn("Rotation vector length mismatch it is", rotVec.length);
      return;
    }
    this.targetRotations = rotVec;
  }
}
