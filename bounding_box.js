class BoundingBox {
  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;
  }

  vectorInside(vec) {
    return (
      vec.x >= this.pos.x &&
      vec.x < this.pos.x + this.width &&
      vec.y >= this.pos.y &&
      vec.y < this.pos.y + this.height
    );
  }
}
