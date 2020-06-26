class Scene {
  constructor(x, y, width, height, showMandelbrot) {
    this.showMandelbrot = showMandelbrot;
    this.gravityFallOff = Math.sqrt(width * width + height * height);

    this.rect = new InsideRectangle(new Clear(), x, y, width, height);
    this.objectList = [this.rect];

    if (showMandelbrot) {
      this.objectList.push(
        new Mandelbrot(
          new Rainbow(),
          x + width / 2,
          y + height / 2,
          Math.min(width, height) / 5
        )
      );
    } else {
      this.setNumObjects(10);
    }
  }

  addRandomObject() {
    const objSize = Math.min(this.rect.box.width, this.rect.box.height) / 8;
    const objX = this.rect.box.x + Math.random() * this.rect.box.width;
    const objY = this.rect.box.y + Math.random() * this.rect.box.height;
    this.objectList.push(
      Math.random() < 0.5
        ? new Circle(new Rainbow(), objX, objY, objSize)
        : new Rectangle(new Rainbow(), objX, objY, objSize, objSize)
    );
  }

  setNumObjects(num) {
    if (this.showMandelbrot || num < 0 || num === this.objectList.length - 1) {
      return;
    }

    if (num < this.objectList.length) {
      this.objectList = this.objectList.slice(0, num);
    } else {
      for (let i = this.objectList.length - 1; i < num; i++) {
        this.addRandomObject();
      }
    }
  }

  checkInBounds(vec, radius = 0) {
    return this.rect.box.vectorInside(vec, radius);
  }

  getClosestObject(vec) {
    return this.objectList.reduce((closest, curr) => {
      const dist = curr.distanceEstimator(vec);
      return closest === 1 || dist < closest.dist
        ? { obj: curr, dist: dist }
        : closest;
    }, 1);
  }

  getForceAt(vec) {
    return this.objectList
      .reduce(
        (total, curr) =>
          curr.mass
            ? total.add(curr.getForceAt(vec, this.gravityFallOff))
            : total,
        Vector.ZERO.copy()
      )
      .divide(this.objectList.length);
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
