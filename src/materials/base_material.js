class BaseMaterial {
  refractiveIndex = 1;
  density = 1;

  calcMass(area) {
    return this.density * area;
  }
}
