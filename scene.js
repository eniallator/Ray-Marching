class Scene {
  constructor(x, y, width, height) {
    this.box = new BoundingBox(x, y, width, height);
    this.circlePos = new Vector(x + width / 2, y + height / 2);
    this.circleRadius = 200;
  }

  checkInBounds(vec) {
    return this.box.vectorInside(vec);
  }

  distanceEstimator(vec) {
    const dist =
      this.circlePos.copy().sub(vec).getMagnitude() - this.circleRadius;
    return Math.max(dist, 0);
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.arc(
    //   this.circlePos.x,
    //   this.circlePos.y,
    //   this.circleRadius,
    //   0,
    //   2 * Math.PI
    // );
    // ctx.fill();
  }
}
