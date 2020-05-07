class Vector {
  constructor(xOrVec, y) {
    this.setHead(xOrVec, y);
  }

  arithmeticOperation(vecOrNum, operation) {
    if (isNaN(vecOrNum)) {
      this.x = operation(this.x, vecOrNum.x);
      this.y = operation(this.y, vecOrNum.y);
    } else {
      this.x = operation(this.x, vecOrNum);
      this.y = operation(this.y, vecOrNum);
    }
  }

  add(vecOrNum) {
    this.arithmeticOperation(vecOrNum, (a, b) => a + b);
    return this;
  }

  sub(vecOrNum) {
    this.arithmeticOperation(vecOrNum, (a, b) => a - b);
    return this;
  }

  multiply(vecOrNum) {
    this.arithmeticOperation(vecOrNum, (a, b) => a * b);
    return this;
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

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  getNorm() {
    const magnitude = this.getMagnitude();
    return new Vector(this.x / magnitude, this.y / magnitude);
  }

  copy() {
    return new Vector(this);
  }
}

Vector.ZERO = new Vector(0, 0);
Vector.ONE = new Vector(1, 1);
