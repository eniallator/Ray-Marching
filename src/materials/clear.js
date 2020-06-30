class Clear extends BaseMaterial {
  density = 0;
  reflectable = false;

  getColour(percent) {
    return "black";
  }
}
