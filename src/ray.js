class Ray {
  constructor(pos, dirNorm) {
    this.initialPos = pos.copy();
    this.pos = pos.copy();
    this.dirNorm = dirNorm;
    this.collisionTolerance = 1;
    this.objectDirectionInfluence = 0.05;

    this.path = [];
  }

  cast(sceneObj) {
    let step = this.collisionTolerance;
    while (
      step >= this.collisionTolerance &&
      (this.inBounds = sceneObj.checkInBounds(this.pos))
    ) {
      const stepVec = sceneObj.distanceEstimator(this.pos);
      step = isNaN(stepVec) ? stepVec.getMagnitude() : stepVec;

      this.path.push({ pos: this.pos.copy(), step: step });
      const offset = this.dirNorm.copy().multiply(step);
      this.pos.add(offset);

      if (isNaN(stepVec)) {
        this.dirNorm = this.dirNorm.add(
          stepVec.getNorm().multiply(this.objectDirectionInfluence)
        );
      }
    }

    this.colour = sceneObj.getColour(this.pos);
  }

  draw(ctx) {
    // for (let item of this.path) {
    //   ctx.beginPath();
    //   ctx.arc(item.pos.x, item.pos.y, item.step, 0, 2 * Math.PI);
    //   ctx.stroke();
    // }

    let prevPos = this.initialPos;

    for (let i in this.path) {
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(this.path[i].pos.x, this.path[i].pos.y);
      ctx.stroke();
      prevPos = this.path[i].pos;
    }

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
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
