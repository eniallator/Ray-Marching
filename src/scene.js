class Scene {
  constructor(x, y, width, height) {
    this.gravityFallOff = Math.sqrt(width * width + height * height);

    this.rect = new InsideRectangle(new Clear(), x, y, width, height);
    const center = new Vector(x + width / 2, y + height / 2);
    let objX, objY;
    this.objectList = new Array(10)
      .fill()
      .map(
        (_) => (
          (objX = x + Math.random() * width),
          (objY = y + Math.random() * height),
          Math.random() < 0.5
            ? new Circle(new Rainbow(), objX, objY, 200)
            : new Rectangle(new Rainbow(), objX, objY, 200, 200)
        )
      );
    // this.objectList.push(this.rect);
  }

  checkInBounds(vec) {
    return this.rect.box.vectorInside(vec);
  }

  getColour(vec) {
    const closestObj = this.objectList.reduce((closest, curr) => {
      const d = curr.distanceEstimator(vec);
      return closest === 1 || d < closest.d ? { obj: curr, d: d } : closest;
    }, 1);

    return closestObj.obj.getColour(vec);
  }

  getForceAt(vec) {
    return this.objectList
      .reduce(
        (total, curr) => total.add(curr.getForceAt(vec, this.gravityFallOff)),
        Vector.ZERO.copy()
      )
      .divide(this.objectList.length);
  }

  distanceEstimator(vec) {
    const distances = this.objectList.map((obj) => obj.distanceEstimator(vec));

    return Math.max(0, Math.min(...distances));
  }

  draw(ctx) {
    ctx.globalAlpha = 0.2;
    for (let obj of this.objectList) {
      if (obj.draw) {
        obj.draw(ctx);
      }
    }
    ctx.globalAlpha = 1;
  }
}