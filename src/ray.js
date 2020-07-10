class Ray {
  constructor(
    pos,
    dirNorm,
    maxReflections,
    forceInfluence,
    maxStep,
    curveInfluence,
    visualiseSteps
  ) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.initialDir = dirNorm.copy();
    this.dirNorm = dirNorm;
    this.maxReflections = maxReflections;
    this.forceInfluence = forceInfluence;
    this.maxStep = maxStep;
    this.curveInfluence = curveInfluence;
    this.visualiseSteps = visualiseSteps;

    this.collisionTolerance = 0.1;
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
    let leftOverDist = 0;
    let closestObj;

    while (
      reflections <= this.maxReflections &&
      (this.inBounds = scene.checkInBounds(this.pos, this.collisionTolerance))
    ) {
      if (this.maxStep > 0 && leftOverDist >= this.maxStep) {
        leftOverDist -= step = this.maxStep;
      } else {
        const { obj, dist } = scene.getClosestObject(this.pos);
        step = this.maxStep > 0 && dist > this.maxStep ? this.maxStep : dist;
        leftOverDist = dist - step;
        closestObj = obj;
      }

      this.path.push({ pos: this.pos.copy(), step: step });

      if (step < this.collisionTolerance) {
        if (++reflections <= this.maxReflections) {
          const surfaceNormal = closestObj.getSurfaceNormal(this.pos);
          this.dirNorm = this.dirNorm.sub(
            surfaceNormal.copy().multiply(2 * this.dirNorm.dot(surfaceNormal))
          );
        }

        this.collisionPoints.push({
          pos: this.pos.copy(),
          colour: closestObj.getColour(this.pos),
          inBounds: scene.checkInBounds(this.pos),
        });

        this.pos.add(this.dirNorm.copy().multiply(this.collisionTolerance));
      } else {
        const offset = this.dirNorm.copy().multiply(step);
        this.pos.add(offset);

        if (this.forceInfluence !== 0) {
          this.dirNorm = this.dirNorm
            .add(scene.getForceAt(this.pos).multiply(this.forceInfluence, step))
            .getNorm();
        }
      }
    }
  }

  drawLineInbetween(ctx, curr, prev, sign) {
    if (
      prev === undefined ||
      this.curveInfluence === 0 ||
      this.curveInfluence < 0
    ) {
      ctx.lineTo(curr.x, curr.y);
    } else {
      const offset = prev.copy().sub(curr).multiply(this.curveInfluence);
      offset.setAngle(offset.getAngle() + sign * (Math.PI / 2));
      const pt1 = prev.copy().add(offset);
      const pt2 = curr.copy().add(offset);
      ctx.bezierCurveTo(pt1.x, pt1.y, pt2.x, pt2.y, curr.x, curr.y);
    }
  }

  draw(ctx) {
    if (this.visualiseSteps) {
      for (let item of this.path) {
        if (item.step >= this.collisionTolerance) {
          ctx.beginPath();
          ctx.arc(item.pos.x, item.pos.y, item.step, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    ctx.beginPath();
    ctx.moveTo(this.initialPos.x, this.initialPos.y);

    if (this.curveInfluence || this.forceInfluence || this.maxReflections) {
      let prevPos;
      for (let i = 0; i < this.path.length; i++) {
        const item = this.path[i];
        this.drawLineInbetween(ctx, item.pos, prevPos, (i % 2) * 2 - 1);
        prevPos = item.pos;
      }
      this.drawLineInbetween(
        ctx,
        this.pos,
        prevPos,
        (this.path.length % 2) * 2 - 1
      );
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
