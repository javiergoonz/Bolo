import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Luckiest Guy";

loadFont({ family: FONT, url: staticFile("fonts/LuckiestGuy.woff2") });

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Palette sampled from the reference video.
export const C = {
  ink: "#24170f", // outlines and dark text
  white: "#ffffff",
  yellow: "#ffe14a",
  navy: "#232c8c",
  red: "#e8473f",
  cream: "#fffaf0",
  orange: "#f7a23b",
  orangeDark: "#e57d20",
  cheek: "#f4877f",
  hair: "#4b2a12",
  shoe: "#ffffff",
  shoeStripe: "#e8413b",
  grass: "#1f6a28",
  grassBack: "#2a7d31",
  nightTop: "#0b1035",
  nightBottom: "#24318a",
  dayTop: "#7cd0f7",
  dayBottom: "#cdeffd",
  spaceTop: "#06051a",
  spaceBottom: "#2a1d5c",
  water: "#3a8fe0",
  waterDark: "#2a6fc2",
  sand: "#f7d89c",
  sun: "#ffd23f",
  moon: "#fdf2a6",
  leaf: "#3aa64a",
  leafDark: "#2b8a3a",
  trunk: "#8a5a32",
  snow: "#f2f8ff",
  ice: "#bfe8ff",
  desert: "#f2b462",
};

export const SW = 6; // default outline width
