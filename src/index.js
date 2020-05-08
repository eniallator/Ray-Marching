const simplex = new SimplexNoise(new Date().getTime());

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const aspectRatio = 16 / 9;

const noScrollbarOffset = 5;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
// const numRays = 720;
// const numRays = 2880;
const numRays = 20;

const timeToRepeat = 10000;
const noiseScale = 0.1;
let prevTime = new Date().getTime();
let currTime = 0;

function run() {
  // if (mouseMoved) {
  const percentRound = currTime / timeToRepeat;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  scene.draw(ctx);

  for (let i = 0; i < numRays; i++) {
    const angle = Math.PI / 4 + (i * Math.PI * 2) / numRays;
    const dir = new Vector(Math.sin(angle), Math.cos(angle));
    // const position = mouse;
    const position = new Vector(
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

    const ray = new Ray(position, dir);
    ray.cast(scene);
    ray.draw(ctx);
  }

  //   mouseMoved = false;
  // }
  const now = new Date().getTime();
  currTime = (currTime + now - prevTime) % timeToRepeat;
  prevTime = now;

  requestAnimationFrame(run);
}

run();
