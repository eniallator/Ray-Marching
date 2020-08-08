class Lens extends BaseObject {
  constructor(material, x, y) {
    const pos = new Vector(x, y);
    super(material, pos, 100);
    this.pos = pos;
  }

  distanceEstimator(vec) {
    const relativeVec = new Vector(vec.x - this.pos.x, vec.y - this.pos.y);
    const x = relativeVec.x;
    const y = relativeVec.y;
    const sign = 2 * (x ** 2 > y) - 1;
    console.log(sign, x ** 2, y);

    const discriminant = Math.sqrt(4 * y - 3 * x ** 2 - 2);
    const roots = [x, (x + discriminant) / 2, (x - discriminant) / 2];
    // const positions = roots
    //   .filter((n) => n >= 0)
    //   .map((x) => new Vector(x, x ** 2));

    const closestDist = roots.reduce((closest, root) => {
      if (!(root < 0 || root >= 0)) return closest;
      const pointOnLine = new Vector(root, root ** 2);
      const dist = pointOnLine.sub(relativeVec).getMagnitude();
      return dist < closest ? dist : closest;
    }, Infinity);
    console.log(closestDist);
    return sign * closestDist;
  }
}
