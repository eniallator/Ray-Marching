class Vector {
  constructor(xOrVec, y) {
    this.setHead(xOrVec, y);
  }

  pow(...args) {
    timeAnalysis.startTime(Vector, "pow");
    for (let arg of args) {
      if (arg > 0 || arg <= 0) {
        this.x = this.x ** arg;
        this.y = this.y ** arg;
      } else {
        this.x = this.x ** arg.x;
        this.y = this.y ** arg.y;
      }
    }
    timeAnalysis.endTime(Vector, "pow");
    return this;
  }

  add(...args) {
    timeAnalysis.startTime(Vector, "add");
    for (let arg of args) {
      if (arg > 0 || arg <= 0) {
        this.x = this.x + arg;
        this.y = this.y + arg;
      } else {
        this.x = this.x + arg.x;
        this.y = this.y + arg.y;
      }
    }
    timeAnalysis.endTime(Vector, "add");
    return this;
  }

  sub(...args) {
    timeAnalysis.startTime(Vector, "sub");
    for (let arg of args) {
      if (arg > 0 || arg <= 0) {
        this.x = this.x - arg;
        this.y = this.y - arg;
      } else {
        this.x = this.x - arg.x;
        this.y = this.y - arg.y;
      }
    }
    timeAnalysis.endTime(Vector, "sub");
    return this;
  }

  multiply(...args) {
    timeAnalysis.startTime(Vector, "multiply");
    for (let arg of args) {
      if (arg > 0 || arg <= 0) {
        this.x = this.x * arg;
        this.y = this.y * arg;
      } else {
        this.x = this.x * arg.x;
        this.y = this.y * arg.y;
      }
    }
    timeAnalysis.endTime(Vector, "multiply");
    return this;
  }

  divide(...args) {
    timeAnalysis.startTime(Vector, "divide");
    for (let arg of args) {
      if (arg > 0 || arg <= 0) {
        this.x = this.x / arg;
        this.y = this.y / arg;
      } else {
        this.x = this.x / arg.x;
        this.y = this.y / arg.y;
      }
    }
    timeAnalysis.endTime(Vector, "divide");
    return this;
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  getMax() {
    return Math.max(this.x, this.y);
  }
  getMin() {
    return Math.min(this.x, this.y);
  }

  setHead(xOrVec, y) {
    if (y > 0 || y <= 0) {
      this.x = xOrVec;
      this.y = y;
    } else {
      this.x = xOrVec.x;
      this.y = xOrVec.y;
    }

    return this;
  }

  getSquaredMagnitude() {
    return this.x * this.x + this.y * this.y;
  }

  getMagnitude() {
    return Math.sqrt(this.getSquaredMagnitude());
  }

  setMagnitude(mag) {
    const magRatio = mag / this.getMagnitude();
    this.x *= magRatio;
    this.y *= magRatio;

    return this;
  }

  getNorm() {
    const magnitude = this.getMagnitude();
    return new Vector(this.x / magnitude, this.y / magnitude);
  }

  getSign() {
    const x = this.x ? this.x / Math.abs(this.x) : 1;
    const y = this.y ? this.y / Math.abs(this.y) : 1;
    return new Vector(x, y);
  }

  getAngle() {
    const quadrants = {
      "x:1,y:1": () => (!this.y ? 0 : Math.atan(this.y / this.x)),
      "x:-1,y:1": () =>
        !this.x ? Math.PI / 2 : Math.PI - Math.atan(this.y / -this.x),
      "x:-1,y:-1": () =>
        !this.y ? Math.PI : (Math.PI * 3) / 2 - Math.atan(this.x / this.y),
      "x:1,y:-1": () =>
        !this.y ? 0 : (Math.PI * 3) / 2 + Math.atan(this.x / -this.y),
    };
    return quadrants[this.getSign().toString()]();
  }

  setAngle(angle) {
    const magnitude = this.getMagnitude();
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);

    return this;
  }

  copy() {
    return new Vector(this);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `x:${this.x},y:${this.y}`;
  }
}

Vector.ZERO = new Vector(0, 0);
Vector.ONE = new Vector(1, 1);
