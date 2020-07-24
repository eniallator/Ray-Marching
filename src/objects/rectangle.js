class Rectangle extends BaseObject {
  constructor(material, x, y, width, height) {
    const center = new Vector(x + width / 2, y + height / 2);
    super(material, center, width * height);

    this.hypotenuse = Math.sqrt(width * width + height * height);
    this.center = center;
    this.box = new BoundingBox(x, y, width, height);
  }

  distanceEstimator(vec) {
    if (this.box.vectorInside(vec)) {
      return vec
        .copy()
        .sub(this.center)
        .abs()
        .sub(new Vector(this.box.width / 2, this.box.height / 2))
        .getMax();
    }

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

  getColour(vec) {
    const dx = (vec.x - this.box.x) / this.box.width;
    const dy = (vec.y - this.box.y) / this.box.height;

    return this.material.getColour(dx + dy);
  }

  getSurfaceNormal(vec) {
    const diff = vec.copy().sub(this.center);
    const xBigger = Math.abs(diff.x) > Math.abs(diff.y);
    return diff.getSign().multiply(new Vector(+xBigger, 1 - xBigger));
  }

  draw(ctx) {
    ctx.fillRect(this.box.x, this.box.y, this.box.width, this.box.height);
  }
}
