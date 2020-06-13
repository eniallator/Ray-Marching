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

  time(cls, action, callback, args = []) {
    this.startTime(cls, action);
    const returnVal = callback(...args);
    this.endTime(cls, action);
    return returnVal;
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
    const auditHelp =
      "Runtime analysis audit (times are measured in milliseconds)\n-------------------------------------\n\n";
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
    return auditHelp + audit;
  }

  clearTimes() {
    this.times = new Map();
  }
}