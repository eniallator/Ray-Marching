class Circle extends BaseObject {
  constructor(material, x, y, diameter) {
    super(material);

    this.pos = new Vector(x, y);
    this.diameter = diameter;
  }

  getForceAt(vec, gravityFallOff) {
    const diff = this.pos.copy().sub(vec);
    const mag = diff.getMagnitude();
    if (mag < this.diameter / 2 || mag > gravityFallOff + this.diameter / 2) {
      return Vector.ZERO.copy();
    }
    diff.setMagnitude(
      1 - (diff.getMagnitude() - this.diameter / 2) / gravityFallOff
    );
    return diff;
  }

  distanceEstimator(vec) {
    return this.pos.copy().sub(vec).getMagnitude() - this.diameter / 2;
  }

  getColour(vec) {
    const dx = (vec.x - this.pos.x) / this.diameter;
    const dy = (vec.y - this.pos.y) / this.diameter;

    return this.material.getColour(dx + dy);
  }

  getSurfaceNormal(vec) {
    return vec.copy().sub(this.pos).getNorm();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.diameter / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
