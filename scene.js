class Scene {
  constructor(x, y, width, height) {
    this.box = new BoundingBox(x, y, width, height);
    // this.circlePos = new Vector(x + width / 2, y + height / 2);
    // this.circleRadius = 200;
    const center = new Vector(x + width / 2, y + height / 2);
    this.objectList = [
      new Circle(center.x - 90, center.y, 100),
      new Rectangle(center.x - 10, center.y - 100, 200, 200),
    ];
  }

  checkInBounds(vec) {
    return this.box.vectorInside(vec);
  }

  distanceEstimator(vec) {
    const distances = this.objectList.map((obj) => obj.distanceEstimator(vec));
    return Math.min(...distances);
  }

  draw(ctx) {
    ctx.globalAlpha = 0.2;
    for (let obj of this.objectList) {
      obj.draw(ctx);
    }
    ctx.globalAlpha = 1;
  }
}
