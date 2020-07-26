class Clear extends BaseMaterial {
  density = 0;
  refractiveIndex = 1.0003;

  getColour(percent) {
    return "black";
  }
}
