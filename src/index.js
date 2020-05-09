const simplex = new SimplexNoise(new Date().getTime());

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const aspectRatio = 16 / 9;

const noScrollbarOffset = 5;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - $("#parameter-config").height();

canvas.width -= noScrollbarOffset;
canvas.height -= noScrollbarOffset;

ctx.strokeStyle = "white";

const mouse = Vector.ONE.copy();
let mouseMoved = true;

canvas.onmousemove = (ev) => {
  mouse.setHead(ev.clientX, ev.clientY);
  mouseMoved = true;
};
canvas.ontouchmove = (ev) => {
  mouse.setHead(ev.touches[0].clientX, ev.touches[0].clientY);
  mouseMoved = true;
};

const scene = new Scene(0, 0, canvas.width, canvas.height);

const paramRegex = /[?&]?([^=]+)=([^&]*)/g;
const urlParams = {};
let tokens;
while ((tokens = paramRegex.exec(document.location.search))) {
  urlParams[tokens[1]] = tokens[2];
}

const config = {};
const setValConfig = (key) => (evt) => (config[key] = +$(evt.target).val());
const setDefaultVal = (id, value) => $(id).val(value);
const getVal = (id) => String($(id).val());
const parameterConfig = {
  useMouse: {
    id: "use-mouse",
    default: false,
    serialise: (id) => String($(id).prop("checked")),
    deserialise: (val) => val.toLowerCase() === "true",
    setDefault: (id, value) => {
      $(id).prop("checked", value);
    },
    change: (key) => (evt) => {
      mouseMoved = true;
      config[key] = $(evt.target).is(":checked");
    },
  },
  numRays: {
    id: "num-rays",
    default: 720,
    serialise: getVal,
    deserialise: Number,
    setDefault: setDefaultVal,
    change: setValConfig,
  },
  maxReflections: {
    id: "max-reflections",
    default: 0,
    serialise: getVal,
    deserialise: Number,
    setDefault: setDefaultVal,
    change: setValConfig,
  },
  maxStep: {
    id: "max-step",
    default: 0,
    serialise: getVal,
    deserialise: Number,
    setDefault: setDefaultVal,
    change: setValConfig,
  },
  rayAngleOffset: {
    id: "ray-angle-offset",
    default: 0,
    serialise: getVal,
    deserialise: Number,
    setDefault: setDefaultVal,
    change: setValConfig,
  },
  forceInfluence: {
    id: "force-influence",
    default: 0,
    serialise: getVal,
    deserialise: Number,
    setDefault: setDefaultVal,
    change: setValConfig,
  },
};

const initParams = () => {
  for (let param in parameterConfig) {
    const cfgData = parameterConfig[param];
    const htmlElId = `#${cfgData.id}`;
    $(htmlElId).change(cfgData.change(param));
    let val = cfgData.default;
    if (urlParams[param] !== undefined) {
      val = cfgData.deserialise(urlParams[param]);
    }
    cfgData.setDefault(htmlElId, val);
    $(htmlElId).trigger("change");
  }
};

new ClipboardJS("#share-btn", {
  text: (trigger) => {
    let params = "";
    for (let param in parameterConfig) {
      if (params !== "") {
        params += "&";
      }
      const cfgData = parameterConfig[param];
      params += param + "=" + cfgData.serialise(`#${cfgData.id}`);
    }
    return (
      location.protocol +
      "//" +
      location.host +
      location.pathname +
      "?" +
      params
    );
  },
}).on("success", (evt) => alert("Copied share link to clipboard"));

const timeToRepeat = 30000;
const noiseScale = 0.5;
let prevTime = new Date().getTime();
let currTime = 0;

const getNoiseCoordinates = (percentRound) =>
  new Vector(
    (simplex.noise2D(
      noiseScale * Math.sin(percentRound * Math.PI * 2),
      noiseScale * Math.cos(percentRound * Math.PI * 2)
    ) +
      1) /
      2,
    (simplex.noise2D(
      noiseScale * Math.sin(percentRound * Math.PI * 2) + 10000,
      noiseScale * Math.cos(percentRound * Math.PI * 2) + 10000
    ) +
      1) /
      2
  ).multiply(new Vector(canvas.width, canvas.height));

function run() {
  if (!config.useMouse || mouseMoved) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    scene.draw(ctx);

    for (let i = 0; i < config.numRays; i++) {
      const angle = (i / config.numRays + config.rayAngleOffset) * Math.PI * 2;
      const dir = new Vector(Math.sin(angle), Math.cos(angle));
      const position = config.useMouse
        ? mouse
        : getNoiseCoordinates(currTime / timeToRepeat);

      const ray = new Ray(
        position,
        dir,
        config.maxReflections,
        config.forceInfluence,
        config.maxStep
      );
      ray.cast(scene);
      ray.draw(ctx);
    }

    mouseMoved = false;
  }

  const now = new Date().getTime();
  currTime = (currTime + now - prevTime) % timeToRepeat;
  prevTime = now;

  requestAnimationFrame(run);
}

initParams();
run();
