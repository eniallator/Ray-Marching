class Scene {
  constructor(x, y, width, height) {
    const rainbow = new Rainbow();

    this.rect = new InsideRectangle(rainbow, x, y, width, height);
    const center = new Vector(x + width / 2, y + height / 2);
    // let objX, objY;
    // this.objectList = new Array(10)
    //   .fill()
    //   .map(
    //     (_) => (
    //       (objX = x + Math.random() * width),
    //       (objY = y + Math.random() * height),
    //       Math.random() < 0.5
    //         ? new Circle(objX, objY, 200)
    //         : new Rectangle(objX, objY, 200, 200)
    //     )
    //   );
    this.objectList = [
      this.rect,
      new Circle(rainbow, center.x - 90, center.y, 200),
      new Rectangle(rainbow, center.x - 10, center.y - 100, 200, 200),
      // new Mandelbrot(center.x, center.y, 100),
    ];

    this.objectList;
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
