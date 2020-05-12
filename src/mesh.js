class Mesh {
  constructor(pos, numRays, forceInfluence) {
    this.pos = pos;
    this.rays = new Array(numRays)
      .fill(null)
      .map(
        (_, i) =>
          new Ray(
            pos.copy(),
            new Vector(1, 0).setAngle((i / numRays) * Math.PI * 2),
            0,
            forceInfluence,
            0,
            0
          )
      );
    this.diffTolerance = 50;
  }

  cast(scene) {
    // const collisionPoints = this.rays.map((ray) => {
    //   ray.cast(scene);
    //   return ray.collisionPoints[0];
    // });

    // this.meshPoints = collisionPoints.map((item) => item.pos);
    // this.furthestDistance = this.meshPoints
    //   .reduce((furthest, curr) =>
    //     furthest.getSquaredMagnitude() > curr.getSquaredMagnitude()
    //       ? furthest
    //       : curr
    //   )
    //   .getMagnitude();
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
        this.meshPoints.push(curr.pos);
      }
    }
  }

  draw(ctx, lightRadius) {
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
}
