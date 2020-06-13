class TimeAnalysis {
  constructor() {
    this.times = new Map();
  }

  safeAddTime(cls, action) {
    if (!this.times.has(cls)) {
      this.times.set(cls, {});
    }
    if (!this.times.get(cls).hasOwnProperty(action)) {
      this.times.get(cls)[action] = { total: 0, calls: 0 };
    }
  }

  startTime(cls, action) {
    this.safeAddTime(cls, action);
    this.times.get(cls)[action].start = Date.now();
  }

  endTime(cls, action) {
    const currAction = this.times.get(cls)[action];
    currAction.total += Date.now() - currAction.start;
    currAction.calls++;
  }

  generateAudit() {
    let audit = "";

    for (let cls of this.times.keys()) {
      if (audit !== "") {
        audit += "\n\n";
      }
      audit += `Times for ${cls.name === undefined ? cls : cls.name}`;
      for (let action of Object.keys(this.times.get(cls))) {
        const currAction = this.times.get(cls)[action];
        audit += `\n- ${action}: `;
        if (currAction.calls > 1) {
          audit += `total: ${currAction.total}, average: ${
            currAction.total / currAction.calls
          } over ${currAction.calls} calls`;
        } else {
          audit += currAction.total;
        }
      }
    }
    return audit;
  }

  clearTimes() {
    this.times = new Map();
  }
}
