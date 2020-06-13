class BaseObject {
  constructor(material, centerOfMass, area) {
    this.material = material;
    this.centerOfMass = centerOfMass;
    this.mass = material.calcMass(area);
  }

  getForceAt(vec, gravityFallOff) {
    if (this.mass === 0) {
      return Vector.ZERO.copy();
    }
    const diff = this.centerOfMass.copy().sub(vec);
    const mag = diff.getMagnitude();
    diff.setMagnitude(this.mass / mag / gravityFallOff);
    timeAnalysis.endTime(BaseObject, "getForceAt");
    return diff;
  }

  getColour(vec) {}
}
