class Diamond extends BaseMaterial {
  density = 2;
  refractiveIndex = 2.4;

  getColour(percent) {
    return "aqua";
  }
}
