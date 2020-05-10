const numberParam = {
  serialise: (tag) => String(tag.val()),
  deserialise: Number,
  setVal: (tag, val) => tag.val(val),
  change: (key, stateObj) => (evt) =>
    (stateObj[key].val = +$(evt.target).val()),
};

const paramTypes = {
  checkbox: {
    serialise: (tag) => String(tag.prop("checked")),
    deserialise: (val) => val.toLowerCase() === "true",
    setVal: (tag, val) => {
      tag.prop("checked", val);
    },
    change: (key, stateObj) => (evt) => {
      stateObj[key].val = $(evt.target).is(":checked");
    },
  },
  number: { ...numberParam },
  range: { ...numberParam },
};

class ParamConfig {
  constructor(parameterConfig, rawUrlParams, baseEl) {
    this.state = {};
    const initialValues = this.parseUrlParams(rawUrlParams);

    for (let cfgData of parameterConfig) {
      const inpTag = $(document.createElement("input")).attr(
        "type",
        cfgData.type
      );
      if (cfgData.attrs) {
        for (let attr in cfgData.attrs) {
          inpTag.attr(attr, cfgData.attrs[attr]);
        }
      }
      baseEl.append(
        $(document.createElement("label"))
          .css("display", "inline-block")
          .append(
            cfgData.label
              ? $(document.createElement("label"))
                  .attr("for", cfgData.id)
                  .text(cfgData.label)
              : "",
            inpTag
          )
      );

      const typeCfg = paramTypes[cfgData.type];
      const stateKey = cfgData.id;
      this.state[stateKey] = { tag: inpTag, serialise: typeCfg.serialise };
      inpTag.change(typeCfg.change(stateKey, this.state));

      typeCfg.setVal(
        inpTag,
        initialValues[cfgData.id] !== undefined
          ? typeCfg.deserialise(initialValues[cfgData.id])
          : cfgData.default
      );
      inpTag.trigger("change");
    }
  }

  parseUrlParams(rawUrlParams) {
    const paramRegex = /[?&]?([^=]+)=([^&]*)/g;
    const parsed = {};
    let tokens;
    while ((tokens = paramRegex.exec(rawUrlParams))) {
      parsed[tokens[1]] = tokens[2];
    }
    return parsed;
  }

  getVal(key) {
    return this.state[key].val;
  }

  serialiseToURLParams() {
    let params = "";
    for (let key in this.state) {
      if (params !== "") {
        params += "&";
      }
      params += key + "=" + this.state[key].serialise(this.state[key].tag);
    }
    return params;
  }
}
