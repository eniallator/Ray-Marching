const MATERIALS = [Rainbow, Diamond, Glass];
const OBJECTS = [
  (material, box) =>
    new Circle(
      material,
      box.x + Math.random() * box.width,
      box.y + Math.random() * box.height,
      Math.min(box.width, box.height) / 8
    ),
  (material, box) =>
    new Rectangle(
      material,
      box.x + Math.random() * box.width,
      box.y + Math.random() * box.height,
      Math.min(box.width, box.height) / 8,
      Math.min(box.width, box.height) / 8
    ),
];

class Scene {
  constructor(x, y, width, height, showMandelbrot, material) {
    this.showMandelbrot = showMandelbrot;
    this.gravityFallOff = Math.sqrt(width * width + height * height);

    this.rect = new InsideRectangle(
      material || new Clear(),
      x,
      y,
      width,
      height
    );
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
    const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    const mat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    this.objectList.push(obj(new mat(), this.rect.box));
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

  getClosestObject(vec, refractiveIndex) {
    return this.objectList.reduce((closest, curr) => {
      let dist = curr.distanceEstimator(vec);

      return closest === null || dist < closest.dist
        ? {
            obj: curr,
            dist: dist,
            refractiveIndex:
              dist < 0
                ? curr.material.refractiveIndex
                : this.rect.material.refractiveIndex,
          }
        : {
            ...closest,
            refractiveIndex:
              curr.material.refractiveIndex && dist < 0
                ? curr.material.refractiveIndex
                : closest.refractiveIndex,
          };
    }, null);
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
