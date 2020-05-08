class Rectangle extends BaseObject {
  constructor(material, x, y, width, height) {
    super(material);

    this.box = new BoundingBox(x, y, width, height);
    this.center = new Vector(x + width / 2, y + height / 2);
  }

  distanceEstimator(vec) {
    const dx =
      vec.x < this.box.x
        ? vec.x - this.box.x
        : Math.max(0, vec.x - this.box.x - this.box.width);
    const dy =
      vec.y < this.box.y
        ? vec.y - this.box.y
        : Math.max(0, vec.y - this.box.y - this.box.height);
    // const dx = Math.max(
    //   this.box.x - vec.x,
    //   0,
    //   vec.x - this.box.x - this.box.width
    // );
    // const dy = Math.max(
    //   this.box.y - vec.y,
    //   0,
    //   vec.y - this.box.y - this.box.height
    // );

    return new Vector(dx, dy).multiply(-1);
    return Math.sqrt(dx * dx + dy * dy);
  }

  getColour(vec) {
    const dx = (vec.x - this.box.x) / this.box.width;
    const dy = (vec.y - this.box.y) / this.box.height;

    return this.material.getColour(dx + dy);
  }

  draw(ctx) {
    ctx.fillRect(this.box.x, this.box.y, this.box.width, this.box.height);
  }
}
