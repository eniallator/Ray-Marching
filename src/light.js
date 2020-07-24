class Light {
  constructor(
    numRays,
    pos,
    maxBounces,
    forceInfluence,
    maxStep,
    curveInfluence,
    visualiseSteps,
    initialAngle,
    initialFov
  ) {
    initialFov = initialFov || Math.PI * 2;
    initialAngle = initialAngle || 0;

    this.pos = pos.copy();
    this.forceInfluence = forceInfluence;
    this.rays = new Array(numRays)
      .fill()
      .map(
        (_, i) =>
          new Ray(
            pos,
            new Vector(1, 0).setAngle(
              initialAngle + (((2 * i - numRays) / numRays) * initialFov) / 2
            ),
            maxBounces,
            forceInfluence,
            maxStep,
            curveInfluence,
            visualiseSteps
          )
      );

    this.recastRays = true;
    this.diffTolerance = 50;
    this.angleTolerance = 0.01;
  }

  setPos(pos) {
    this.recastRays = this.recastRays || !this.pos.equals(pos);
    this.posUpdated = this.posUpdated || !this.pos.equals(pos);
    this.pos = pos.copy();
  }

  setUseMesh(value) {
    this.recastRays = this.recastRays || this.useMesh !== value;
    this.useMesh = value;
  }

  _cosineLaw(p1, p2, p3) {
    const aSqr = p1.copy().sub(p2).getSquaredMagnitude();
    const bSqr = p1.copy().sub(p3).getSquaredMagnitude();
    const cSqr = p2.copy().sub(p3).getSquaredMagnitude();

    return Math.acos(
      (aSqr + bSqr - cSqr) / (2 * Math.sqrt(aSqr) * Math.sqrt(bSqr))
    );
  }

  createMeshBetween(bigger, rayLength, nextRayLength) {
    const newPoints = [];
    let currStep = 0;
    for (let i = bigger.path.length - 1; i >= 0; i--) {
      const curr = bigger.path[i];
      currStep += curr.step;

      if (currStep < this.diffTolerance) {
        continue;
      }
      if (
        Math.max(rayLength, nextRayLength) -
          currStep -
          Math.min(rayLength, nextRayLength) <
        this.diffTolerance
      ) {
        break;
      }
      newPoints.push(curr.pos);
    }
    return rayLength < nextRayLength ? newPoints.reverse() : newPoints;
  }

  createMesh() {
    this.meshPoints = [];
    this.rays.forEach((ray) => ray.cast(scene));

    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];

      const rayLength = ray.path.reduce((acc, item) => acc + item.step, 0);
      const nextRay = this.rays[(i + 1) % this.rays.length];
      const nextRayLength = nextRay.path.reduce(
        (acc, item) => acc + item.step,
        0
      );
      const diff = rayLength - nextRayLength;
      const bigger = diff > 0 ? ray : nextRay;

      const currPoint = ray.collisionPoints[0]
        ? ray.collisionPoints[0].pos
        : ray.pos;
      const nextPoint = nextRay.collisionPoints[0]
        ? nextRay.collisionPoints[0].pos
        : nextRay.pos;

      this.meshPoints.push(currPoint);
      if (!this.forceInfluence) {
        continue;
      }

      let prevPoint = this.meshPoints[this.meshPoints.length - 2];
      if (prevPoint && prevPoint.x === undefined) {
        prevPoint = prevPoint[prevPoint.length - 1];
      }
      if (
        prevPoint === undefined ||
        !(
          this._cosineLaw(prevPoint, currPoint, nextPoint) <
            this.angleTolerance ||
          this._cosineLaw(
            currPoint,
            nextPoint,
            this.rays[(i + 2) % this.rays.length].collisionPoints[0]
              ? this.rays[(i + 2) % this.rays.length].collisionPoints[0].pos
              : this.rays[(i + 2) % this.rays.length].pos
          ) < this.angleTolerance
        )
      ) {
        this.meshPoints.push(
          this.createMeshBetween(bigger, rayLength, nextRayLength)
        );
      }
    }

    this.meshPoints = this.meshPoints.flat();
  }

  drawMesh(ctx, brightness, lightRadius) {
    const gradient = ctx.createRadialGradient(
      this.pos.x,
      this.pos.y,
      0,
      this.pos.x,
      this.pos.y,
      lightRadius
    );

    gradient.addColorStop(0, this.brightnessToHSL(brightness));
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;

    ctx.beginPath();
    this.meshPoints.forEach((point, i) =>
      i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
    );
    ctx.fill();
  }

  cast(scene) {
    for (let ray of this.rays) {
      if (this.posUpdated) {
        ray.setPos(this.pos);
      }
      ray.cast(scene);
    }
    if (this.useMesh) {
      this.createMesh();
    }
    this.posUpdated = false;
  }

  brightnessToHSL(brightness) {
    return `hsl(0, 0%, ${Math.round(100 * brightness)}%)`;
  }

  draw(ctx, brightness, lightRadius) {
    if (this.useMesh) {
      this.drawMesh(ctx, brightness, lightRadius);
    } else {
      const strokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = this.brightnessToHSL(brightness);
      for (let ray of this.rays) {
        ray.draw(ctx);
      }
      ctx.strokeStyle = strokeStyle;
    }
  }

  shine(scene, ctx, brightness, lightRadius, forceRecast) {
    if (this.recastRays || forceRecast) {
      this.cast(scene);
      this.recastRays = false;
    }
    this.draw(ctx, brightness, lightRadius);
  }
}
