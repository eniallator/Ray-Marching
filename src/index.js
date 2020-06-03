const paramConfig = new ParamConfig(
  parameterConfig,
  window.location.search,
  $("#cfg-outer")
);

const simplex = new SimplexNoise(new Date().getTime());

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let firstRun = true;
let canvasDiagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
let scene;
window.onresize = (evt) => {
  canvas.width = $("#canvas").width();
  canvas.height = $("#canvas").height();
  canvasDiagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

  if (firstRun) {
    firstRun = false;
  } else {
    scene = new Scene(
      0,
      0,
      canvas.width,
      canvas.height,
      paramConfig.getVal("show-mandelbrot")
    );

    paramConfig.tellListeners();
  }
};
window.onresize();

ctx.strokeStyle = "white";

const mouse = Vector.ONE.copy();

canvas.onmousemove = (ev) => {
  mouse.setHead(ev.clientX, ev.clientY);
};
canvas.ontouchmove = (ev) => {
  mouse.setHead(ev.touches[0].clientX, ev.touches[0].clientY);
};

scene = new Scene(
  0,
  0,
  canvas.width,
  canvas.height,
  paramConfig.getVal("show-mandelbrot")
);

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

const getNoiseCoordinates = (percentRound, offset = 1) =>
  new Vector(
    (simplex.noise2D(
      noiseScale * Math.cos(percentRound * Math.PI * 2) + offset * 10,
      noiseScale * Math.sin(percentRound * Math.PI * 2) + offset * 10
    ) +
      1) /
      2,
    (simplex.noise2D(
      noiseScale * Math.cos(percentRound * Math.PI * 2) + offset * 20,
      noiseScale * Math.sin(percentRound * Math.PI * 2) + offset * 20
    ) +
      1) /
      2
  ).multiply(new Vector(canvas.width, canvas.height));

const lights = [];
paramConfig.addListener((state, updates) => {
  lights.length = 0;
  const center = new Vector(canvas.width / 2, canvas.height / 2);
  const offset = center.copy().multiply(2 / 3);
  for (let i = 0; i < paramConfig.getVal("num-lights"); i++) {
    lights.push(
      new Light(
        paramConfig.getVal("num-rays"),
        Vector.ZERO.copy(),
        paramConfig.getVal("max-reflections"),
        paramConfig.getVal("force-influence"),
        paramConfig.getVal("max-step"),
        paramConfig.getVal("curve-influence")
      )
    );
  }

  if (updates.includes("show-mandelbrot")) {
    scene = new Scene(
      0,
      0,
      canvas.width,
      canvas.height,
      paramConfig.getVal("show-mandelbrot")
    );
  }
});

function run() {
  ctx.globalCompositeOperation = "darken";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.globalCompositeOperation = paramConfig.getVal("mesh")
    ? "lighten"
    : "source-over";

  scene.setNumObjects(paramConfig.getVal("num-objects"));
  scene.draw(ctx);

  lights.forEach((light) => light.setUseMesh(paramConfig.getVal("mesh")));

  if (paramConfig.getVal("use-mouse")) {
    lights[0].setPos(mouse);
    lights[0].shine(
      scene,
      ctx,
      paramConfig.getVal("light-radius") * canvasDiagonal
    );
  } else {
    const percentRound = currTime / timeToRepeat;
    const position = paramConfig.getVal("use-mouse")
      ? mouse
      : getNoiseCoordinates(percentRound);

    lights.forEach((light, i) =>
      light.setPos(getNoiseCoordinates(percentRound, i + 1))
    );

    for (let light of lights) {
      light.shine(
        scene,
        ctx,
        paramConfig.getVal("light-radius") * canvasDiagonal
      );
    }
  }

  const now = new Date().getTime();
  currTime = (currTime + now - prevTime) % timeToRepeat;
  prevTime = now;

  requestAnimationFrame(run);
}

run();
