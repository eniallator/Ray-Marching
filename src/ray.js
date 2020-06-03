class Ray {
  constructor(
    pos,
    dirNorm,
    maxReflections,
    forceInfluence,
    maxStep,
    curveInfluence
  ) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.initialDir = dirNorm.copy();
    this.dirNorm = dirNorm;
    this.maxReflections = maxReflections;
    this.forceInfluence = forceInfluence;
    this.maxStep = maxStep;
    this.curveInfluence = curveInfluence;

    this.collisionTolerance = 1;
  }

  reset() {
    this.path = [];
    this.collisionPoints = [];
    this.dirNorm = this.initialDir.copy();
    this.pos = this.initialPos.copy();
  }

  setPos(pos) {
    this.initialPos = pos.copy();
  }

  cast(scene) {
    this.reset();
    let step = this.collisionTolerance;
    let reflections = 0;

    while (
      reflections <= this.maxReflections &&
      (this.inBounds = scene.checkInBounds(this.pos))
    ) {
      const distToClosestObj = scene.distanceEstimator(this.pos);
      step =
        this.maxStep > 0 && distToClosestObj > this.maxStep
          ? this.maxStep
          : distToClosestObj;

      this.path.push({ pos: this.pos.copy(), step: step });

      if (step < this.collisionTolerance) {
        if (++reflections <= this.maxReflections) {
          const surfaceNormal = scene.getClosestSurfaceNormal(this.pos);
          this.dirNorm = this.dirNorm.sub(
            surfaceNormal.copy().multiply(2 * this.dirNorm.dot(surfaceNormal))
          );
        }

        this.collisionPoints.push({
          pos: this.pos.copy(),
          colour: scene.getColour(this.pos),
          inBounds: scene.checkInBounds(this.pos),
        });

        this.pos.add(this.dirNorm.copy().multiply(this.collisionTolerance));
      } else {
        const offset = this.dirNorm.copy().multiply(step);
        this.pos.add(offset);
        this.dirNorm = this.dirNorm
          .add(scene.getForceAt(this.pos).multiply(this.forceInfluence, step))
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

    let prevPos;
    for (let i = 0; i < this.path.length; i++) {
      const item = this.path[i];
      if (i == 0 || !this.curveInfluence || this.curveInfluence < 0) {
        ctx.lineTo(item.pos.x, item.pos.y);
      } else {
        const offset = prevPos
          .copy()
          .sub(item.pos)
          .multiply(this.curveInfluence);
        offset.setAngle(offset.getAngle() + (((i % 2) * 2 - 1) * Math.PI) / 2);
        const pt1 = prevPos.copy().add(offset);
        const pt2 = item.pos.copy().add(offset);
        ctx.bezierCurveTo(pt1.x, pt1.y, pt2.x, pt2.y, item.pos.x, item.pos.y);
      }
      prevPos = item.pos;
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
