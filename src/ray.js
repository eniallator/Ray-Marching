class Ray {
  constructor(pos, dirNorm) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.dirNorm = dirNorm;
    this.collisionTolerance = 1;
    this.forceInfluence = 0.04;

    this.path = [];
  }

  cast(sceneObj) {
    let step = this.collisionTolerance;
    while (
      step >= this.collisionTolerance &&
      (this.inBounds = sceneObj.checkInBounds(this.pos))
    ) {
      step = sceneObj.distanceEstimator(this.pos);

      this.path.push({ pos: this.pos.copy(), step: step });
      const offset = this.dirNorm.copy().multiply(step);
      this.pos.add(offset);

      this.dirNorm = this.dirNorm
        .add(sceneObj.getForceAt(this.pos).multiply(this.forceInfluence))
        .getNorm();
    }

    this.colour = sceneObj.getColour(this.pos);
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

    if (this.inBounds) {
      const oldFill = ctx.fillStyle;
      ctx.fillStyle = this.colour;

      ctx.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
      ctx.fillStyle = oldFill;
    }
  }
}
