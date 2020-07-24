const parameterConfig = [
  {
    id: "mesh",
    label: "Mesh",
    default: false,
    type: "checkbox",
  },
  {
    id: "use-mouse",
    label: "Use mouse",
    default: false,
    type: "checkbox",
  },
  {
    id: "show-mandelbrot",
    label: "Show mandelbrot",
    default: false,
    type: "checkbox",
  },
  {
    id: "visualise-steps",
    label: "Visualise ray steps",
    default: false,
    type: "checkbox",
  },
  {
    id: "num-objects",
    label: "Number of objects",
    default: 10,
    type: "number",
    attrs: {
      min: 0,
      max: 50,
    },
  },
  {
    id: "num-lights",
    label: "Number of lights",
    default: 1,
    type: "number",
    attrs: {
      min: 0,
      max: 10,
    },
  },
  {
    id: "num-rays",
    label: "Number of rays",
    default: 720,
    type: "number",
    attrs: {
      min: 1,
      max: 2000,
    },
  },
  {
    id: "max-bounces",
    label: "Max bounces",
    default: 0,
    type: "number",
    attrs: {
      min: 0,
      max: 10,
    },
  },
  {
    id: "max-step",
    label: "Max ray step",
    default: 0,
    type: "number",
    attrs: {
      min: 0,
      max: 100,
    },
  },
  {
    id: "speed-multiplier",
    label: "Speed multiplier",
    default: 1,
    type: "number",
    attrs: {
      min: 0.25,
      max: 3,
      step: 0.25,
    },
  },
  {
    id: "brightness",
    label: "Brightness",
    default: 1,
    type: "range",
    attrs: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
  {
    id: "ray-angle-offset",
    label: "Ray angle offset",
    default: 0,
    type: "range",
    attrs: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
  {
    id: "light-radius",
    label: "Light radius",
    default: 1,
    type: "range",
    attrs: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
  {
    id: "force-influence",
    label: "Object gravity influence",
    default: 0,
    type: "range",
    attrs: {
      min: 0,
      max: 0.2,
      step: 0.01,
    },
  },
  {
    id: "curve-influence",
    label: "Curve influence",
    default: 0,
    type: "range",
    attrs: {
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
];
