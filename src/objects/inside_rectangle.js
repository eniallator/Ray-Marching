class InsideRectangle extends Rectangle {
  getColour(vec) {
    const percent = this.box.pos
      .copy()
      .sub(vec)
      .divide(new Vector(this.box.width, this.box.height))
      .getMax();
    return this.material.getColour(percent);
  }

  getForceAt(vec, gravityFallOff) {
    return super.getForceAt(vec, gravityFallOff).multiply(-1);
  }

  distanceEstimator(vec) {
    return -super.distanceEstimator(vec);
  }

  draw(ctx) {}
}
