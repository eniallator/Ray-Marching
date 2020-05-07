class Circle {
  constructor(x, y, radius) {
    this.pos = new Vector(x, y);
    this.radius = radius;
  }

  distanceEstimator(vec) {
    console.log(this.pos, vec, this.radius);

    return this.pos.copy().sub(vec).getMagnitude() - this.radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
