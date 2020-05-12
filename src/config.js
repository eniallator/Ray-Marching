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
    id: "max-reflections",
    label: "Max reflections",
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