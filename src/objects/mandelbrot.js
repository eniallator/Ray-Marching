class Mandelbrot extends BaseObject {
  constructor(material, x, y, size) {
    const center = new Vector(x, y);
    super(material, center.copy(), Math.PI * (size / 2) ** 2);

    this.pos = center;
    this.size = size;
  }

  getColour(vec) {
    return this.material.getColour((vec.x - this.pos.x) / this.size);
  }

  distanceEstimator(vec) {
    const c = vec.copy().sub(this.pos).divide(this.size);

    // From: https://www.iquilezles.org/www/articles/distancefractals/distancefractals.htm
    const c2 = c.dot(c);
    // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm
    if (256.0 * c2 * c2 - 96.0 * c2 + 32.0 * c.x - 3.0 < 0.0) return 0.0;
    // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm
    if (16.0 * (c2 + 2.0 * c.x + 1.0) - 1.0 < 0.0) return 0.0;

    // iterate
    let z = Vector.ZERO.copy();
    let dz = Vector.ZERO.copy();
    let di = 1.0;
    let m2 = 0.0;
    for (let i = 0; i < 100; i++) {
      if (m2 > 1024.0) {
        di = 0.0;
        break;
      }

      // Z' -> 2·Z·Z' + 1
      dz = new Vector(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x)
        .multiply(2)
        .add(new Vector(1.0, 0.0));

      // Z -> Z² + c
      z = new Vector(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y).add(c);

      m2 = z.dot(z);
    }

    // distance
    // d(c) = |Z|·log|Z|/|Z'|
    let d = 0.5 * Math.sqrt(z.dot(z) / dz.dot(dz)) * Math.log(z.dot(z));
    if (di > 0.5) d = 0.0;

    return (d * this.size) / 2;
  }
}
