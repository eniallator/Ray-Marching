class Circle extends BaseObject {
  constructor(material, x, y, diameter) {
    const pos = new Vector(x, y);

    super(material, pos.copy(), Math.PI * (diameter / 2) ** 2);

    this.pos = pos;
    this.diameter = diameter;
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
