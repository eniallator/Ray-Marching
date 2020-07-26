class Glass extends BaseMaterial {
  density = 1;
  refractiveIndex = 1.52;

  getColour(percent) {
    return "black";
  }
}
