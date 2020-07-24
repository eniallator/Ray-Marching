class Rainbow extends BaseMaterial {
  density = 1;
  refractiveIndex = 1.2;

  getColour(percent) {
    return `hsl(${360 * percent}, 100%, 50%)`;
  }
}
