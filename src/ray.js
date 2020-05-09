class Ray {
  constructor(pos, dirNorm, maxReflections, forceInfluence, maxStep) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.dirNorm = dirNorm;
    this.maxReflections = maxReflections || 0;
    this.forceInfluence = forceInfluence || 0;

    this.collisionTolerance = 1;
    this.maxStep = maxStep;

    this.collisionPoints = [];
    this.path = [];
  }

  cast(sceneObj) {
    let step = this.collisionTolerance;
    let reflections = 0;
    while (
      reflections <= this.maxReflections &&
      (this.inBounds = sceneObj.checkInBounds(this.pos))
    ) {
      const distToClosestObj = sceneObj.distanceEstimator(this.pos);
      step =
        this.maxStep > 0 && distToClosestObj > this.maxStep
          ? this.maxStep
          : distToClosestObj;

      this.path.push({ pos: this.pos.copy(), step: step });

      if (step < this.collisionTolerance) {
        if (++reflections <= this.maxReflections) {
          const surfaceNormal = sceneObj.getClosestSurfaceNormal(this.pos);
          this.dirNorm = this.dirNorm.sub(
            surfaceNormal.copy().multiply(2 * this.dirNorm.dot(surfaceNormal))
          );
        }

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

        ctx.beginPath();
        ctx.arc(point.pos.x, point.pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = oldFill;
      }
    }
  }
}
