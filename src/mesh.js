class Mesh {
  constructor(pos, numRays) {
    this.pos = pos;
    this.rays = new Array(numRays)
      .fill(null)
      .map(
        (_, i) =>
          new Ray(
            pos.copy(),
            new Vector(1, 0).setAngle((i / numRays) * Math.PI * 2),
            0,
            0,
            0,
            0
          )
      );
  }

  cast(scene) {
    const collisionPoints = this.rays.map((ray) => {
      ray.cast(scene);
      return ray.collisionPoints[0];
    });

    this.meshPoints = collisionPoints.map((item) => item.pos);
    this.furthestDistance = this.meshPoints
      .reduce((furthest, curr) =>
        furthest.getSquaredMagnitude() > curr.getSquaredMagnitude()
          ? furthest
          : curr
      )
      .getMagnitude();
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
