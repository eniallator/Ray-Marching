class Rectangle {
  constructor(x, y, width, height) {
    this.box = new BoundingBox(x, y, width, height);
  }

  distanceEstimator(vec) {
    const dx = Math.max(
      this.box.x - vec.x,
      0,
      vec.x - this.box.x - this.box.width
    );
    const dy = Math.max(
      this.box.y - vec.y,
      0,
      vec.y - this.box.y - this.box.height
    );

    return Math.sqrt(dx * dx + dy * dy);
  }

  draw(ctx) {
    ctx.fillRect(this.box.x, this.box.y, this.box.width, this.box.height);
  }
}
