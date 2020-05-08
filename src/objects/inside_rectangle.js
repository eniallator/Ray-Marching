class InsideRectangle extends Rectangle {
  distanceEstimator(vec) {
    const dx = Math.min(
      vec.x - this.box.x,
      this.box.width + this.box.x - vec.x
    );
    const dy = Math.min(
      vec.y - this.box.y,
      this.box.height + this.box.y - vec.y
    );

    return Math.min(dx, dy);
  }

  getColour(vec) {
    return "black";
  }

  draw(ctx) {}
}
