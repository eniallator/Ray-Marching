class BaseObject {
  constructor(material, centerOfMass, area) {
    this.material = material;
    this.centerOfMass = centerOfMass;
    this.mass = material.calcMass(area);
  }

  getForceAt(vec, gravityFallOff) {
    const diff = this.centerOfMass.copy().sub(vec);
    const mag = diff.getMagnitude();
    if (this.mass <= 0) {
      return Vector.ZERO.copy();
    }
    diff.setMagnitude(this.mass / mag / gravityFallOff);
    return diff;
  }

  getColour(vec) {}
}
