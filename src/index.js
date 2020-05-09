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

const config = {};

$("#use-mouse")
  .change((evt) => {
    mouseMoved = true;
    config.useMouse = $(evt.target).is(":checked");
  })
  .trigger("change");
$("#num-rays")
  .change((evt) => (config.numRays = +$(evt.target).val()))
  .trigger("change");
$("#max-reflections")
  .change((evt) => (config.maxReflections = +$(evt.target).val()))
  .trigger("change");
$("#max-step")
  .change((evt) => (config.maxStep = +$(evt.target).val()))
  .trigger("change");
$("#ray-angle-offset")
  .change((evt) => (config.rayAngleOffset = +$(evt.target).val()))
  .trigger("change");
$("#force-influence")
  .change((evt) => (config.forceInfluence = +$(evt.target).val()))
  .trigger("change");

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

run();
