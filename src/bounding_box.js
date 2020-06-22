class BoundingBox {
  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  vectorInside(vec, radius = 0) {
    return (
      vec.x - radius >= this.pos.x &&
      vec.x + radius <= this.pos.x + this.width &&
      vec.y - radius >= this.pos.y &&
      vec.y + radius <= this.pos.y + this.height
    );
  }
}
