class Light {
  constructor(
    numRays,
    pos,
    maxReflections,
    forceInfluence,
    maxStep,
    curveInfluence,
    initialAngle,
    initialFov
  ) {
    initialFov = initialFov || Math.PI * 2;
    initialAngle = initialAngle || 0;

    this.pos = pos.copy();
    this.rays = new Array(numRays)
      .fill()
      .map(
        (_, i) =>
          new Ray(
            pos,
            new Vector(1, 0).setAngle(
              initialAngle + (((2 * i - numRays) / numRays) * initialFov) / 2
            ),
            maxReflections,
            forceInfluence,
            maxStep,
            curveInfluence
          )
      );

    this.recastRays = true;
    this.diffTolerance = 50;
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

      this.meshPoints.push(ray.collisionPoints[0].pos);

      let newPoints = [];
      let currStep = 0;
      for (let j = bigger.path.length - 1; j >= 0; j--) {
        const curr = bigger.path[j];
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
      if (rayLength < nextRayLength) {
        newPoints = newPoints.reverse();
      }
      this.meshPoints = [...this.meshPoints, ...newPoints];
    }
  }

  drawMesh(ctx, lightRadius) {
    const gradient = ctx.createRadialGradient(
      this.pos.x,
      this.pos.y,
      0,
      this.pos.x,
      this.pos.y,
      lightRadius
    );

    gradient.addColorStop(0, "#707070");
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

  draw(ctx, lightRadius) {
    if (this.useMesh) {
      this.drawMesh(ctx, lightRadius);
    } else {
      for (let ray of this.rays) {
        ray.draw(ctx);
      }
    }
  }

  shine(scene, ctx, lightRadius, forceRecast) {
    if (this.recastRays || forceRecast) {
      timeAnalysis.startTime(Light, "cast");
      this.cast(scene);
      timeAnalysis.endTime(Light, "cast");
      this.recastRays = false;
    }
    timeAnalysis.startTime(Light, "draw");
    this.draw(ctx, lightRadius);
    timeAnalysis.endTime(Light, "draw");
  }
}
