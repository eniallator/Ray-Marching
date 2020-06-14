class TimeAnalysis {
  constructor() {
    this.times = new Map();
  }

  safeAddTime(cls, action) {
    if (!this.times.has(cls)) {
      this.times.set(cls, {});
    }
    if (!this.times.get(cls).hasOwnProperty(action)) {
      this.times.get(cls)[action] = { totalTime: 0, calls: 0, manualCalls: 0 };
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
    this.times.get(cls)[action].start = performance.now();
  }

  endTime(cls, action) {
    const currAction = this.times.get(cls)[action];
    currAction.totalTime += performance.now() - currAction.start;
    currAction.calls++;
  }

  addCall(cls, action) {
    this.safeAddTime(cls, action);
    this.times.get(cls)[action].manualCalls++;
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
        let currAudit = "";
        for (let key of Object.keys(currAction)) {
          if (currAction[key] && key !== "start") {
            if (currAudit) currAudit += ", ";
            currAudit += `${key}: ${currAction[key]}`;
          }
        }
        if (currAction.calls > 1) {
          currAudit += `, averageTime: ${
            currAction.totalTime / currAction.calls
          }`;
        }

        audit += `\n- ${action}: ${currAudit}`;
      }
    }
    return `Runtime analysis audit (times are measured in milliseconds)\n-------------------------------------\n\n${audit}`;
  }

  clearTimes() {
    this.times = new Map();
  }
}
