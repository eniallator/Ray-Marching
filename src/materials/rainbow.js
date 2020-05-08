class Rainbow {
  constructor() {}

  getColour(percent) {
    return `hsl(${360 * percent}, 100%, 50%)`;
  }
}
