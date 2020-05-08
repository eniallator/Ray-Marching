class Ray {
  constructor(pos, dirNorm) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.dirNorm = dirNorm;
    this.collisionTolerance = 1;
    // this.forceInfluence = 0.04;
    this.forceInfluence = 0;
    this.maxBounces = 10;

    this.collisionPoints = [];
    this.path = [];
  }

  cast(sceneObj) {
    let step = this.collisionTolerance;
    let bounces = 0;
    while (
      bounces <= this.maxBounces &&
      (this.inBounds = sceneObj.checkInBounds(this.pos))
    ) {
      step = sceneObj.distanceEstimator(this.pos);

      this.path.push({ pos: this.pos.copy(), step: step });

      if (step < this.collisionTolerance) {
        bounces++;
        const surfaceNormal = sceneObj.getClosestSurfaceNormal(this.pos);
        this.dirNorm = this.dirNorm.sub(
          surfaceNormal.copy().multiply(2 * this.dirNorm.dot(surfaceNormal))
        );

        this.collisionPoints.push({
          pos: this.pos.copy(),
          colour: sceneObj.getColour(this.pos),
          inBounds: sceneObj.checkInBounds(this.pos),
        });

        this.pos.add(this.dirNorm.copy().multiply(this.collisionTolerance));
      } else {
        const offset = this.dirNorm.copy().multiply(step);
        this.pos.add(offset);
        this.dirNorm = this.dirNorm
          .add(sceneObj.getForceAt(this.pos).multiply(this.forceInfluence))
          .getNorm();
      }
    }
  }

  draw(ctx) {
    // for (let item of this.path) {
    //   ctx.beginPath();
    //   ctx.arc(item.pos.x, item.pos.y, item.step, 0, 2 * Math.PI);
    //   ctx.stroke();
    // }

    ctx.beginPath();
    ctx.moveTo(this.initialPos.x, this.initialPos.y);
    for (let item of this.path) {
      ctx.lineTo(item.pos.x, item.pos.y);
    }
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.stroke();

    for (let point of this.collisionPoints) {
      if (point.inBounds) {
        const oldFill = ctx.fillStyle;
        ctx.fillStyle = point.colour;

        ctx.fillRect(point.pos.x - 2, point.pos.y - 2, 4, 4);
        ctx.fillStyle = oldFill;
      }
    }
  }
}
