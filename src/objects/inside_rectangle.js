class InsideRectangle extends Rectangle {
  distanceEstimator(vec) {
    // const dx =
    //   vec.x < this.center.x
    //     ? vec.x - this.box.x
    //     : vec.x - this.box.x - this.box.width;
    // const dy =
    //   vec.y < this.center.y
    //     ? vec.y - this.box.y
    //     : vec.y - this.box.y - this.box.height;
    const dx = Math.min(
      vec.x - this.box.x,
      this.box.width + this.box.x - vec.x
    );
    const dy = Math.min(
      vec.y - this.box.y,
      this.box.height + this.box.y - vec.y
    );

    // if (Math.abs(dx) < Math.abs(dy)) {
    //   return new Vector(-dx, 0);
    // }
    // return new Vector(0, -dy);

    return Math.min(dx, dy);
  }

  getColour(vec) {
    return "black";
  }

  getForceAt(vec) {
    return Vector.ZERO.copy();
  }
  draw(ctx) {}
}
