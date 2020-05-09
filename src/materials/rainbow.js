class Rainbow extends BaseMaterial {
  density = 1;

  getColour(percent) {
    return `hsl(${360 * percent}, 100%, 50%)`;
  }
}
