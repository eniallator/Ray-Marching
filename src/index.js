const paramConfig = new ParamConfig(
  parameterConfig,
  window.location.search,
  $("#cfg-outer")
);

const simplex = new SimplexNoise(new Date().getTime());

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const aspectRatio = 16 / 9;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - $("#parameter-config").height();

const noScrollbarOffset = 5;
canvas.width -= noScrollbarOffset;
canvas.height -= noScrollbarOffset;

ctx.strokeStyle = "white";

const mouse = Vector.ONE.copy();

canvas.onmousemove = (ev) => {
  mouse.setHead(ev.clientX, ev.clientY);
};
canvas.ontouchmove = (ev) => {
  mouse.setHead(ev.touches[0].clientX, ev.touches[0].clientY);
};

const scene = new Scene(0, 0, canvas.width, canvas.height);

new ClipboardJS("#share-btn", {
  text: (trigger) => {
    return (
      location.protocol +
      "//" +
      location.host +
      location.pathname +
      "?" +
      paramConfig.serialiseToURLParams()
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
      noiseScale * Math.cos(percentRound * Math.PI * 2),
      noiseScale * Math.sin(percentRound * Math.PI * 2)
    ) +
      1) /
      2,
    (simplex.noise2D(
      noiseScale * Math.cos(percentRound * Math.PI * 2) + 10000,
      noiseScale * Math.sin(percentRound * Math.PI * 2) + 10000
    ) +
      1) /
      2
  ).multiply(new Vector(canvas.width, canvas.height));

function run() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  scene.draw(ctx);

  for (let i = 0; i < paramConfig.getVal("num-rays"); i++) {
    const angle =
      (i / paramConfig.getVal("num-rays") +
        paramConfig.getVal("ray-angle-offset")) *
      Math.PI *
      2;
    const dir = new Vector(Math.sin(angle), Math.cos(angle));
    const position = paramConfig.getVal("use-mouse")
      ? mouse
      : getNoiseCoordinates(currTime / timeToRepeat);

    const ray = new Ray(
      position,
      dir,
      paramConfig.getVal("max-reflections"),
      paramConfig.getVal("force-influence"),
      paramConfig.getVal("max-step")
    );
    ray.cast(scene);
    ray.draw(ctx);
  }

  const now = new Date().getTime();
  currTime = (currTime + now - prevTime) % timeToRepeat;
  prevTime = now;

  requestAnimationFrame(run);
}

run();
