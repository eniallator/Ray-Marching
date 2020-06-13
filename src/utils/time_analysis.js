class TimeAnalysis {
  constructor() {
    this.times = new Map();
  }

  safeAddTime(cls, action, obj) {
    if (!this.times.has(cls)) {
      this.times.set(cls, {});
    }
    if (!this.times.get(cls).hasOwnProperty(action)) {
      this.times.get(cls)[action] = new Map();
    }
    if (!this.times.get(cls)[action].has(obj)) {
      this.times.get(cls)[action].set(obj, {});
    }
  }

  startTime(cls, action, obj) {
    this.safeAddTime(cls, action, obj);
    this.times.get(cls)[action].get(obj).start = Date.now();
  }

  endTime(cls, action, obj) {
    this.safeAddTime(cls, action, obj);
    this.times.get(cls)[action].get(obj).end = Date.now();
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
        const total = { start: 0, end: 0 };
        for (let curr of currAction.values()) {
          total.start += curr.start;
          total.end += curr.end;
        }
        const totalDiff = total.end - total.start;
        audit += `\n- ${action}: `;
        if (currAction.size > 1) {
          audit += `total: ${totalDiff}, average: ${
            totalDiff / currAction.size
          } over ${currAction.size} calls`;
        } else {
          audit += totalDiff;
        }
      }
    }
    return audit;
  }

  clearTimes() {
    this.times = new Map();
  }
}
