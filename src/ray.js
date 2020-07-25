class Ray {
  constructor(
    pos,
    dirNorm,
    maxBounces,
    forceInfluence,
    maxStep,
    curveInfluence,
    visualiseSteps
  ) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.initialDir = dirNorm.copy();
    this.dirNorm = dirNorm;
    this.maxBounces = maxBounces;
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

  posMod(a, b) {
    return ((a % b) + b) % b;
  }

  cast(scene) {
    this.reset();
    let step = this.collisionTolerance;
    let bounces = 0;
    let leftOverDist = 0;
    let pathLength = 0;
    let closestObj, refractiveIndex, closestRefractiveIndex;

    while (
      bounces <= this.maxBounces &&
      (this.inBounds = scene.checkInBounds(this.pos, this.collisionTolerance))
    ) {
      if (this.maxStep > 0 && leftOverDist >= this.maxStep) {
        leftOverDist -= step = this.maxStep;
      } else {
        const {
          obj,
          dist: rawDist,
          refractiveIndex: newRefractiveIndex,
        } = scene.getClosestObject(this.pos, -this.collisionTolerance);
        let dist = rawDist;
        if (
          refractiveIndex !== undefined &&
          obj.material.refractiveIndex === refractiveIndex
        ) {
          dist *= -1;
        }

        if (refractiveIndex === undefined) {
          refractiveIndex =
            rawDist <= this.collisionTolerance
              ? obj.material.refractiveIndex
              : scene.refractiveIndex;
        }

        step = this.maxStep > 0 && dist > this.maxStep ? this.maxStep : dist;
        leftOverDist = dist - step;
        closestObj = obj;
        closestRefractiveIndex = newRefractiveIndex;
      }

      this.path.push({ pos: this.pos.copy(), step: step });
      pathLength += step;

      if (step < this.collisionTolerance) {
        this.collisionPoints.push({
          pos: this.pos.copy(),
          colour: closestObj.getColour(this.pos),
          inBounds: scene.checkInBounds(this.pos),
        });
        if (closestObj.getSurfaceNormal === undefined) {
          break;
        } else if (
          closestObj.material.refractiveIndex !== undefined &&
          refractiveIndex !== closestRefractiveIndex
        ) {
          bounces++;
          const surfaceNormal = closestObj.getSurfaceNormal(this.pos);
          let boundaryNormal = surfaceNormal;
          const angleDiff = this.posMod(
            this.dirNorm.getAngle() - surfaceNormal.getAngle(),
            2 * Math.PI
          );
          if (angleDiff > Math.PI / 2 && angleDiff < (Math.PI * 3) / 2) {
            boundaryNormal = surfaceNormal.copy().multiply(-1);
          }
          const boundaryAngle = boundaryNormal.getAngle();
          const angleOfRefraction = Math.asin(
            (refractiveIndex *
              Math.sin(boundaryAngle - this.dirNorm.getAngle())) /
              closestRefractiveIndex
          );

          if (angleOfRefraction > 0 || angleOfRefraction <= 0) {
            this.dirNorm = new Vector(1, 0).setAngle(
              boundaryAngle - angleOfRefraction
            );
            refractiveIndex = closestRefractiveIndex;
          } else {
            this.dirNorm = this.dirNorm.sub(
              surfaceNormal.copy().multiply(2 * this.dirNorm.dot(surfaceNormal))
            );
          }
        }

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

    if (this.curveInfluence || this.forceInfluence || this.maxBounces) {
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
