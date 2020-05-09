class Vector {
  constructor(xOrVec, y) {
    this.setHead(xOrVec, y);
  }

  arithmeticOperation(args, operation) {
    for (let arg of args) {
      if (isNaN(arg)) {
        this.x = operation(this.x, arg.x);
        this.y = operation(this.y, arg.y);
      } else {
        this.x = operation(this.x, arg);
        this.y = operation(this.y, arg);
      }
    }
  }

  pow(...args) {
    this.arithmeticOperation(args, (a, b) => a ** b);
    return this;
  }

  add(...args) {
    this.arithmeticOperation(args, (a, b) => a + b);
    return this;
  }

  sub(...args) {
    this.arithmeticOperation(args, (a, b) => a - b);
    return this;
  }

  multiply(...args) {
    this.arithmeticOperation(args, (a, b) => a * b);
    return this;
  }

  divide(...args) {
    this.arithmeticOperation(args, (a, b) => a / b);
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
    if (isNaN(y)) {
      this.x = xOrVec.x;
      this.y = xOrVec.y;
    } else {
      this.x = xOrVec;
      this.y = y;
    }
  }

  getSquaredMagnitude() {
    return this.x ** 2 + this.y ** 2;
  }

  getMagnitude() {
    return Math.sqrt(this.getSquaredMagnitude());
  }

  setMagnitude(mag) {
    const magRatio = mag / this.getMagnitude();
    this.x *= magRatio;
    this.y *= magRatio;
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

  copy() {
    return new Vector(this);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

Vector.ZERO = new Vector(0, 0);
Vector.ONE = new Vector(1, 1);
