class FieldLine {
  constructor(strength, maxStep, startDir, start, end) {
    this.strength = strength;
    this.maxStep = maxStep;
    this.startDir = startDir;
    this.start = start;
    this.end = end;
    this.endObj = new BaseObject(
      { calcMass: (area) => area },
      this.end,
      strength * 1000
    );
  }

  cast(scene) {
    this.ray = new Ray(
      this.start,
      this.startDir,
      0,
      this.strength,
      this.maxStep
    );
    this.ray.cast(scene);
  }

  draw(ctx) {
    this.ray.draw(ctx);
  }
}

class MagnetMaterial extends BaseMaterial {
  density = 0;
}

class BarMagnet {
  constructor(strength, numLines, fieldBounds, maxStep, x, y, width, height) {
    this.fieldBounds = fieldBounds;
    this.gravityFallOff = Math.sqrt(
      fieldBounds.box.width ** 2 + fieldBounds.box.height ** 2
    );
    this.box = new Rectangle(new MagnetMaterial(), x, y, width, height);
    this.maxAngle = Math.PI / 4;

    this.fieldLines = [];
    for (let i = 0; i < numLines; i++) {
      const percent = i / (numLines - 1);
      const lineHeight = y + percent * height;
      const angle = (percent * 2 - 1) * this.maxAngle;

      this.fieldLines.push(
        new FieldLine(
          strength,
          maxStep,
          new Vector(Math.cos(angle), Math.sin(angle)),
          new Vector(x + width + 1, lineHeight),
          new Vector(x, lineHeight)
        )
      );
    }
  }

  checkInBounds(vec) {
    return this.fieldBounds.box.vectorInside(vec);
  }

  getColour(vec) {
    return "black";
  }

  distanceEstimator(vec) {
    return this.box.distanceEstimator(vec);
    // return vec
    //   .copy()
    //   .sub(this.fieldLines[this.currentField].end)
    //   .getMagnitude();
  }

  getForceAt(vec) {
    return this.fieldLines[this.currentField].endObj.getForceAt(
      vec,
      this.gravityFallOff
    );
  }

  draw(ctx) {
    ctx.globalAlpha = 0.2;
    this.box.draw(ctx);
    ctx.globalAlpha = 1;

    for (let i in this.fieldLines) {
      const fieldLine = this.fieldLines[i];
      this.currentField = +i;
      fieldLine.cast(this);
      fieldLine.draw(ctx);
    }
  }
}
