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
const numRays = 360;

function run() {
  if (mouseMoved) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    scene.draw(ctx);

    for (let i = 0; i < numRays; i++) {
      const angle = (i * Math.PI * 2) / numRays;
      const dir = new Vector(Math.sin(angle), Math.cos(angle));

      const ray = new Ray(mouse, dir);
      ray.cast(scene);
      ray.draw(ctx);
    }

    mouseMoved = false;
  }

  requestAnimationFrame(run);
}

run();
