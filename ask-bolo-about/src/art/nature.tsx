import React from "react";
import { rand, tr } from "../engine/anim";
import { C } from "../engine/theme";

const OUT = C.ink;
const SW = 6;

type P = { x: number; y: number; s?: number; r?: number; opacity?: number };

/** Blobby union outline: stroke all shapes first, then fill them on top. */
const Union: React.FC<{ circles: [number, number, number][]; fill: string; sw?: number }> = ({ circles, fill, sw = SW }) => (
  <>
    {circles.map(([cx, cy, r], i) => (
      <circle key={`o${i}`} cx={cx} cy={cy} r={r} fill={OUT} stroke={OUT} strokeWidth={sw * 2} />
    ))}
    {circles.map(([cx, cy, r], i) => (
      <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={fill} />
    ))}
  </>
);

export const Tree: React.FC<P & { t?: number; color?: string }> = ({ x, y, s = 1, r = 0, opacity = 1, t = 0, color = C.leaf }) => (
  <g transform={tr(x, y, s, r + Math.sin(t * 1.3 + x) * 1.5)} opacity={opacity}>
    <path d="M -20 0 L -14 -150 L 14 -150 L 20 0 Z" fill={C.trunk} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <Union circles={[[-60, -190, 62], [55, -195, 66], [0, -250, 80], [0, -170, 60]]} fill={color} />
    <circle cx={-28} cy={-270} r={20} fill="#fff" opacity={0.18} />
  </g>
);

export const Stump: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path d="M -34 0 L -28 -48 L 28 -48 L 34 0 Z" fill={C.trunk} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <ellipse cx={0} cy={-48} rx={28} ry={10} fill="#d9a46a" stroke={OUT} strokeWidth={5} />
    <ellipse cx={0} cy={-48} rx={12} ry={4} fill="none" stroke="#a87443" strokeWidth={3} />
  </g>
);

export const Flower: React.FC<P & { color?: string; droop?: number; t?: number }> = ({
  x,
  y,
  s = 1,
  opacity = 1,
  color = "#ff6f91",
  droop = 0,
  t = 0,
}) => {
  const bend = droop * 70 + Math.sin(t * 2 + x) * 3;
  const petal = droop > 0.5 ? "#b9898f" : color;
  return (
    <g transform={tr(x, y, s)} opacity={opacity}>
      <path d={`M 0 0 Q 0 -90 ${bend * 0.9} -${170 - droop * 50}`} fill="none" stroke={OUT} strokeWidth={14} strokeLinecap="round" />
      <path d={`M 0 0 Q 0 -90 ${bend * 0.9} -${170 - droop * 50}`} fill="none" stroke={droop > 0.5 ? "#7f9a4a" : C.leaf} strokeWidth={7} strokeLinecap="round" />
      <path d="M 0 -60 Q 40 -90 60 -70 Q 40 -50 0 -60 Z" fill={C.leaf} stroke={OUT} strokeWidth={5} />
      <g transform={`translate(${bend * 0.9} ${-(170 - droop * 50)}) rotate(${droop * 110})`}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={0} cy={-34} rx={20} ry={30} fill={petal} stroke={OUT} strokeWidth={5} transform={`rotate(${i * 60})`} />
        ))}
        <circle r={22} fill="#ffd23f" stroke={OUT} strokeWidth={5} />
      </g>
    </g>
  );
};

export const GrassTuft: React.FC<P> = ({ x, y, s = 1 }) => (
  <g transform={tr(x, y, s)}>
    <path d="M -24 0 L -30 -36 L -12 -6 L -4 -44 L 6 -6 L 22 -38 L 24 0 Z" fill={C.leafDark} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

export const Wheat: React.FC<P & { t?: number }> = ({ x, y, s = 1, t = 0, opacity = 1 }) => {
  const sway = Math.sin(t * 2.4 + x * 0.05) * 9;
  return (
    <g transform={tr(x, y, s)} opacity={opacity}>
      <g transform={`rotate(${sway})`}>
        <path d="M 0 0 L 0 -220" stroke={OUT} strokeWidth={12} strokeLinecap="round" />
        <path d="M 0 0 L 0 -220" stroke="#d9a63a" strokeWidth={6} strokeLinecap="round" />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <ellipse cx={-13} cy={-200 + i * 24} rx={10} ry={17} fill="#f2c04e" stroke={OUT} strokeWidth={4} transform={`rotate(-25 -13 ${-200 + i * 24})`} />
            <ellipse cx={13} cy={-200 + i * 24} rx={10} ry={17} fill="#f2c04e" stroke={OUT} strokeWidth={4} transform={`rotate(25 13 ${-200 + i * 24})`} />
          </g>
        ))}
        <ellipse cx={0} cy={-232} rx={9} ry={16} fill="#f2c04e" stroke={OUT} strokeWidth={4} />
      </g>
    </g>
  );
};

export const Cactus: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path
      d="M -22 0 L -22 -200 Q -22 -228 0 -228 Q 22 -228 22 -200 L 22 0 Z M -22 -100 L -60 -100 Q -78 -100 -78 -120 L -78 -160 Q -78 -176 -64 -176 Q -50 -176 -50 -160 L -50 -128 L -22 -128 Z M 22 -130 L 58 -130 Q 76 -130 76 -150 L 76 -180 Q 76 -196 62 -196 Q 48 -196 48 -180 L 48 -156 L 22 -156 Z"
      fill="#3fae4f"
      stroke={OUT}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
  </g>
);

export const Mountain: React.FC<P & { w?: number; h?: number; color?: string; snow?: boolean }> = ({
  x,
  y,
  w = 500,
  h = 520,
  color = "#8e9ab8",
  snow = true,
  opacity = 1,
}) => (
  <g transform={tr(x, y)} opacity={opacity}>
    <path d={`M ${-w / 2} 0 L 0 ${-h} L ${w / 2} 0 Z`} fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    {snow ? (
      <path
        d={`M ${-w * 0.14} ${-h * 0.72} L 0 ${-h} L ${w * 0.14} ${-h * 0.72} L ${w * 0.06} ${-h * 0.77} L 0 ${-h * 0.7} L ${-w * 0.06} ${-h * 0.77} Z`}
        fill="#fff"
        stroke={OUT}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    ) : null}
  </g>
);

export const Raindrop: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <path
    transform={tr(x, y, s)}
    opacity={opacity}
    d="M 0 -26 Q 16 -2 14 8 Q 10 20 0 20 Q -10 20 -14 8 Q -16 -2 0 -26 Z"
    fill="#6cc4ff"
    stroke={OUT}
    strokeWidth={4}
  />
);

export const Rain: React.FC<{ t: number; x0?: number; x1?: number; y0?: number; y1?: number; n?: number; opacity?: number }> = ({
  t,
  x0 = 0,
  x1 = 1080,
  y0 = 500,
  y1 = 1500,
  n = 26,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + rand(i + 11) * (x1 - x0);
      const y = y0 + ((rand(i + 31) * (y1 - y0) + t * 900) % (y1 - y0));
      return <Raindrop key={i} x={x} y={y} s={0.9} />;
    })}
  </g>
);

export const Snow: React.FC<{ t: number; n?: number; opacity?: number }> = ({ t, n = 40, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const x = rand(i + 5) * 1080 + Math.sin(t + i) * 20;
      const y = ((rand(i + 70) * 1950 + t * (60 + rand(i) * 70)) % 1950) - 20;
      return <circle key={i} cx={x} cy={y} r={4 + rand(i + 2) * 5} fill="#fff" opacity={0.9} />;
    })}
  </g>
);

export const Iceberg: React.FC<P & { melt?: number; bear?: boolean }> = ({ x, y, s = 1, melt = 0, opacity = 1 }) => {
  const k = 1 - melt * 0.75;
  return (
    <g transform={`${tr(x, y, s)} scale(${k} ${0.6 + 0.4 * k})`} opacity={opacity}>
      <path d="M -170 0 L -120 -90 L -60 -70 L -10 -150 L 60 -95 L 110 -110 L 170 0 Z" fill="#f4fbff" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M -10 -150 L 10 -60 L 60 -95" fill="none" stroke="#bfe0f5" strokeWidth={6} />
      <path d="M -170 0 L -140 70 L 120 80 L 170 0 Z" fill="#bfe8ff" opacity={0.55} />
    </g>
  );
};

export const Bubble: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <circle r={14} fill="#bfefff" fillOpacity={0.35} stroke="#e8fbff" strokeWidth={4} />
    <circle cx={-5} cy={-5} r={3.5} fill="#fff" />
  </g>
);

export const Bubbles: React.FC<{ t: number; x: number; y: number; h?: number; n?: number; spread?: number }> = ({
  t,
  x,
  y,
  h = 600,
  n = 8,
  spread = 50,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const p = (t * 0.35 + rand(i + x) ) % 1;
      return <Bubble key={i} x={x + Math.sin(t * 2 + i) * spread * 0.4 + (rand(i + 3) - 0.5) * spread} y={y - p * h} s={0.6 + rand(i + 9) * 0.8} opacity={1 - p} />;
    })}
  </g>
);

export const Plankton: React.FC<P & { t?: number; color?: string }> = ({ x, y, s = 1, t = 0, opacity = 1, color = "#7ee08a" }) => (
  <g transform={tr(x + Math.sin(t * 1.5 + x) * 8, y + Math.cos(t * 1.2 + y) * 8, s, t * 20)} opacity={opacity}>
    <circle r={20} fill={color} stroke={OUT} strokeWidth={4} />
    <circle cx={-6} cy={-4} r={5} fill="#2e8b57" />
    <circle cx={7} cy={5} r={4} fill="#2e8b57" />
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} d="M 20 0 L 30 0" stroke={OUT} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />
    ))}
  </g>
);

export const Vent: React.FC<P & { t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={tr(x, y, s)}>
    {Array.from({ length: 6 }, (_, i) => {
      const p = (t * 0.25 + i / 6) % 1;
      return <circle key={i} cx={Math.sin(t * 2 + i) * 20 * p} cy={-170 - p * 420} r={30 + p * 50} fill="#3c2f3f" opacity={0.55 * (1 - p)} />;
    })}
    <path d="M -110 0 L -50 -170 L 50 -170 L 110 0 Z" fill="#5b4a46" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <ellipse cx={0} cy={-170} rx={50} ry={14} fill="#ff7a2f" stroke={OUT} strokeWidth={5} />
    <path d="M -30 -100 L -10 -60 L -40 -30" fill="none" stroke="#ff7a2f" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const Microbe: React.FC<P & { t: number; color?: string }> = ({ x, y, s = 1, t, color = "#ff9ad5" }) => (
  <g transform={tr(x + Math.sin(t * 1.7 + x) * 10, y + Math.cos(t * 1.3 + x) * 10, s)}>
    <ellipse rx={30} ry={20} fill={color} stroke={OUT} strokeWidth={4} transform={`rotate(${Math.sin(t * 2 + x) * 15})`} />
    <circle cx={-8} cy={-4} r={5} fill="#fff" stroke={OUT} strokeWidth={2} />
    <circle cx={8} cy={-4} r={5} fill="#fff" stroke={OUT} strokeWidth={2} />
    <circle cx={-8} cy={-4} r={2} fill={OUT} />
    <circle cx={8} cy={-4} r={2} fill={OUT} />
    <path d="M -5 7 Q 0 11 5 7" fill="none" stroke={OUT} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

export const Coral: React.FC<P & { color?: string }> = ({ x, y, s = 1, color = "#ff7a59" }) => (
  <g transform={tr(x, y, s)}>
    <path d="M 0 0 L 0 -90 M 0 -60 L -40 -110 M 0 -80 L 35 -130 M -40 -110 L -55 -140 M -40 -110 L -20 -150" stroke={OUT} strokeWidth={24} strokeLinecap="round" fill="none" />
    <path d="M 0 0 L 0 -90 M 0 -60 L -40 -110 M 0 -80 L 35 -130 M -40 -110 L -55 -140 M -40 -110 L -20 -150" stroke={color} strokeWidth={13} strokeLinecap="round" fill="none" />
  </g>
);

export const Seaweed: React.FC<P & { t: number; color?: string }> = ({ x, y, s = 1, t, color = "#e85aa0" }) => (
  <g transform={tr(x, y, s)}>
    {[-24, -8, 8, 24].map((dx, i) => (
      <path
        key={i}
        d={`M ${dx} 0 Q ${dx + Math.sin(t * 2 + i) * 14} -50 ${dx + Math.sin(t * 2 + i + 1) * 10} -${90 + i * 8}`}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
    ))}
  </g>
);

export const Dune: React.FC<P & { w?: number; color?: string }> = ({ x, y, w = 600, color = C.desert }) => (
  <path d={`M ${x - w / 2} ${y} Q ${x} ${y - w * 0.28} ${x + w / 2} ${y} Z`} fill={color} stroke={OUT} strokeWidth={SW} />
);

export const Cracks: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 1 }) => (
  <g opacity={opacity} stroke="#8a5a2a" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M 80 ${y + 80} L 180 ${y + 140} L 160 ${y + 230} L 260 ${y + 300}`} />
    <path d={`M 180 ${y + 140} L 300 ${y + 120}`} />
    <path d={`M 520 ${y + 60} L 600 ${y + 170} L 700 ${y + 190} L 760 ${y + 320}`} />
    <path d={`M 600 ${y + 170} L 560 ${y + 280}`} />
    <path d={`M 880 ${y + 100} L 960 ${y + 200} L 1040 ${y + 220}`} />
    <path d={`M 350 ${y + 380} L 450 ${y + 450} L 430 ${y + 560}`} />
    <path d={`M 800 ${y + 420} L 900 ${y + 520}`} />
  </g>
);
