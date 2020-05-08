class Circle extends BaseObject {
  constructor(material, x, y, diameter) {
    super(material);

    this.pos = new Vector(x, y);
    this.diameter = diameter;
  }

  distanceEstimator(vec) {
    const diff = this.pos.copy().sub(vec);
    if (diff.getMagnitude() < this.diameter / 2) {
      return Vector.ZERO.copy();
    }
    diff.setMagnitude(diff.getMagnitude() - this.diameter / 2);
    return diff;
  }

  getColour(vec) {
    const dx = (vec.x - this.pos.x) / this.diameter;
    const dy = (vec.y - this.pos.y) / this.diameter;

    return this.material.getColour(dx + dy);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.diameter / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
