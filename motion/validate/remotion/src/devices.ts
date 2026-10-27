export type DeviceSpec = {
  label: string;
  os: string;
  logical: { w: number; h: number };
  physical: { w: number; h: number };
  displayRadius: number;
  frame: {
    side: number;
    top: number;
    bottom: number;
    rim?: number;
    radius: number;
    color: string;
    buttons: { side: string; y: number; h: number; w?: number }[];
  };
  dynamicIsland?: { w: number; h: number; top: number };
  punchHole?: { d: number; top: number };
  homeIndicator?: boolean;
  homeButton?: { d: number; bottom: number };
  mm?: { w: number; h: number; t: number };
};

export const DEVICE: DeviceSpec = {
  "label": "Samsung Galaxy S25 Ultra",
  "os": "android",
  "logical": {
    "w": 480,
    "h": 1040
  },
  "physical": {
    "w": 1440,
    "h": 3120
  },
  "displayRadius": 34,
  "frame": {
    "side": 13,
    "top": 13,
    "bottom": 13,
    "rim": 3.5,
    "radius": 44,
    "color": "graphite",
    "buttons": [
      {
        "side": "right",
        "y": 300,
        "h": 66,
        "w": 2.5
      },
      {
        "side": "right",
        "y": 382,
        "h": 60,
        "w": 2.5
      }
    ]
  },
  "punchHole": {
    "d": 11,
    "top": 13
  },
  "homeIndicator": false,
  "mm": {
    "w": 77.6,
    "h": 162.8,
    "t": 8.2
  }
};

export const PALETTE = {
  "a": "#4d4f53",
  "b": "#202226",
  "c": "#3a3d42",
  "d": "#0f1114",
  "edge": "#7e8186",
  "finish": "polished"
};

export const OUTER = {
  "w": 506,
  "h": 1066
};

export const THICKNESS = 53;

export const STAGE = {
  "width": 1080,
  "height": 1350,
  "padding": 63,
  "stageTop": 202.8,
  "stageHeight": 1090.5,
  "stageWidth": 954,
  "scale": 0.9411444652908068,
  "depth": 53,
  "titleSize": 63,
  "subSize": 26,
  "durationInFrames": 150,
  "fps": 30
};

export const MOTION = {
  "turn": 26,
  "sway": 6,
  "base": {
    "rotateX": 7,
    "rotateY": -22,
    "rotateZ": -1.5
  },
  "blurLayers": 5,
  "blurLag": 0.82,
  "trailOpacity": 0.37
};
