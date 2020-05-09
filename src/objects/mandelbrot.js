class Mandelbrot extends BaseObject {
  constructor(material, x, y, size) {
    super(material);

    this.pos = new Vector(x, y);
    this.size = size;
  }

  distanceEstimator(vec) {
    const c = vec.copy().sub(this.pos).divide(this.size);
    let z = Vector.ZERO.copy();
    let dz = Vector.ZERO.copy();

    let m2;
    for (let i = 0; i < 1024; i++) {
      dz.multiply(2, z, dz).add(1);
      z.multiply(z).add(c);
      m2 = z.getSquaredMagnitude();
      if (m2 > 1e20) {
        break;
      }
    }
    const dist = (Math.sqrt(m2 / dz.getSquaredMagnitude()) / 2) * Math.log(m2);
    return (1 - dist) * this.size;
  }
}
