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
  }

  setPos(pos) {
    this.pos = pos.copy();
    this.recastRays = true;
    this.posUpdated = true;
  }

  cast(scene) {
    for (let ray of this.rays) {
      if (this.posUpdated) {
        ray.setPos(this.pos);
      }
      ray.cast(scene);
    }
    this.posUpdated = false;
  }

  draw(ctx) {
    for (let ray of this.rays) {
      ray.draw(ctx);
    }
  }

  shine(scene, ctx, forceRecast) {
    if (this.recastRays || forceRecast) {
      this.cast(scene);
      this.recastRays = false;
    }

    this.draw(ctx);
  }
}
