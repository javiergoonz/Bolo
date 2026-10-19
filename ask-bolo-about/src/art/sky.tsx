import React, { useId } from "react";
import { rand, tr } from "../engine/anim";
import { C, H, W } from "../engine/theme";

export const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

const OUT = C.ink;

export const Sky: React.FC<{ top: string; bottom: string; y0?: number; y1?: number }> = ({ top, bottom, y0 = 0, y1 = H }) => {
  const id = useUid();
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1={y0} x2="0" y2={y1} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
    </>
  );
};

export const Stars: React.FC<{ t: number; n?: number; seed?: number; maxY?: number; opacity?: number }> = ({
  t,
  n = 110,
  seed = 1,
  maxY = 1400,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const x = rand(seed * 1000 + i) * W;
      const y = rand(seed * 2000 + i * 3) * maxY;
      const r = 1.4 + rand(seed * 3000 + i) * 2.6;
      const tw = 0.55 + 0.45 * Math.sin(t * (1 + rand(i) * 2) + i);
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={tw} />;
    })}
  </g>
);

export const NightSky: React.FC<{ t: number; stars?: number }> = ({ t, stars = 110 }) => (
  <>
    <Sky top={C.nightTop} bottom={C.nightBottom} y1={1300} />
    <Stars t={t} n={stars} />
  </>
);

export const DaySky: React.FC = () => <Sky top={C.dayTop} bottom={C.dayBottom} y1={1300} />;

export const SpaceBg: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky top={C.spaceTop} bottom={C.spaceBottom} />
    <Stars t={t} n={170} seed={4} maxY={H} />
  </>
);

/** Two layered rolling hills; y is the approximate top of the front hill. */
export const Hills: React.FC<{ y?: number; color?: string; back?: string; line?: string }> = ({
  y = 1260,
  color = C.grass,
  back = C.grassBack,
  line = "#0e3513",
}) => {
  const front = `M -20 ${y + 30} C 260 ${y - 40}, 620 ${y + 70}, 1100 ${y - 70}`;
  const backP = `M -20 ${y - 40} C 300 ${y - 120}, 700 ${y - 10}, 1100 ${y - 60}`;
  return (
    <>
      <path d={`${backP} L 1100 ${H} L -20 ${H} Z`} fill={back} />
      <path d={backP} fill="none" stroke={line} strokeWidth={5} opacity={0.6} />
      <path d={`${front} L 1100 ${H} L -20 ${H} Z`} fill={color} />
      <path d={front} fill="none" stroke={line} strokeWidth={6} />
    </>
  );
};

export const FlatGround: React.FC<{ y: number; color: string; line?: string }> = ({ y, color, line = OUT }) => (
  <>
    <rect x={-10} y={y} width={W + 20} height={H - y + 10} fill={color} />
    <path d={`M -10 ${y} L ${W + 10} ${y}`} stroke={line} strokeWidth={6} />
  </>
);

export const Sun: React.FC<{ x: number; y: number; r?: number; t?: number; rays?: boolean; opacity?: number; scale?: number }> = ({
  x,
  y,
  r = 90,
  t = 0,
  rays = true,
  opacity = 1,
  scale = 1,
}) => (
  <g transform={tr(x, y, scale)} opacity={opacity}>
    <circle r={r * 1.7} fill="#ffe680" opacity={0.18} />
    <circle r={r * 1.32} fill="#ffe680" opacity={0.28} />
    {rays ? (
      <g transform={`rotate(${t * 12})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-9} y={-r * 1.62} width={18} height={r * 0.36} rx={9} fill="#ffcf33" stroke={OUT} strokeWidth={4} transform={`rotate(${i * 30})`} />
        ))}
      </g>
    ) : null}
    <circle r={r} fill={C.sun} stroke={OUT} strokeWidth={6} />
    <circle cx={-r * 0.3} cy={-r * 0.32} r={r * 0.22} fill="#fff" opacity={0.35} />
  </g>
);

export const Moon: React.FC<{ x: number; y: number; r?: number; opacity?: number }> = ({ x, y, r = 80, opacity = 1 }) => (
  <g transform={tr(x, y)} opacity={opacity}>
    <circle r={r * 1.55} fill="#fdf2a6" opacity={0.12} />
    <circle r={r * 1.25} fill="#fdf2a6" opacity={0.16} />
    <circle r={r} fill={C.moon} stroke={OUT} strokeWidth={6} />
    <circle cx={-r * 0.3} cy={-r * 0.15} r={r * 0.16} fill="#e6d77e" />
    <circle cx={r * 0.32} cy={r * 0.3} r={r * 0.11} fill="#e6d77e" />
    <circle cx={r * 0.2} cy={-r * 0.42} r={r * 0.08} fill="#e6d77e" />
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; s?: number; opacity?: number; color?: string }> = ({
  x,
  y,
  s = 1,
  opacity = 1,
  color = "#fff",
}) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path
      d="M -120 30 C -150 30, -150 -20, -112 -22 C -108 -70, -40 -80, -22 -44 C 0 -96, 92 -86, 92 -30 C 136 -36, 150 30, 108 30 Z"
      fill={color}
      stroke={OUT}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </g>
);

export const Underwater: React.FC<{ t: number; floor?: number; top?: string; bottom?: string }> = ({
  t,
  floor = 1560,
  top = "#2a7fa8",
  bottom = "#0c2a63",
}) => (
  <>
    <Sky top={top} bottom={bottom} />
    {Array.from({ length: 5 }, (_, i) => (
      <path
        key={i}
        d={`M ${120 + i * 220} 0 L ${200 + i * 220} 0 L ${80 + i * 220 + Math.sin(t + i) * 30} 1500 L ${20 + i * 220 + Math.sin(t + i) * 30} 1500 Z`}
        fill="#fff"
        opacity={0.05}
      />
    ))}
    <path d={`M -20 ${floor} C 300 ${floor - 40}, 700 ${floor + 30}, 1100 ${floor - 20} L 1100 ${H} L -20 ${H} Z`} fill={C.sand} />
    <path d={`M -20 ${floor} C 300 ${floor - 40}, 700 ${floor + 30}, 1100 ${floor - 20}`} fill="none" stroke={OUT} strokeWidth={6} />
  </>
);

/** Side view of a beach: sand slope on the left, sea on the right (reference tide scene). */
export const Coast: React.FC<{ t: number; water?: number; sky?: boolean }> = ({ t, water = 1150, sky = true }) => {
  const wv = Math.sin(t * 1.6) * 6;
  return (
    <>
      {sky ? <DaySky /> : null}
      <path d="M -20 820 L 520 1240 L 1100 1240 L 1100 1920 L -20 1920 Z" fill={C.sand} stroke={OUT} strokeWidth={6} />
      <rect x={-20} y={water + wv} width={W + 40} height={H} fill={C.water} opacity={0.94} />
      <path d={`M -20 ${water + wv} L 1100 ${water + wv}`} stroke={OUT} strokeWidth={5} />
      <rect x={-20} y={water + wv + 4} width={W + 40} height={26} fill="#fff" opacity={0.2} />
    </>
  );
};

/** Vertical split: two backgrounds side by side, like the reference "extreme seasons" shot. */
export const Split: React.FC<{ left: React.ReactNode; right: React.ReactNode; at?: number }> = ({ left, right, at = W / 2 }) => {
  const id = useUid();
  return (
    <>
      <defs>
        <clipPath id={`${id}l`}>
          <rect x={0} y={0} width={at} height={H} />
        </clipPath>
        <clipPath id={`${id}r`}>
          <rect x={at} y={0} width={W - at} height={H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}l)`}>{left}</g>
      <g clipPath={`url(#${id}r)`}>{right}</g>
      <path d={`M ${at} 0 L ${at} ${H}`} stroke={OUT} strokeWidth={6} />
    </>
  );
};

export const HotSide: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky top="#ff9a3c" bottom="#ffd27a" y1={1300} />
    <Sun x={300} y={380} r={95} t={t} />
    <path d="M -20 1250 C 200 1180, 380 1300, 600 1220 L 600 1920 L -20 1920 Z" fill="#f0b45e" stroke={OUT} strokeWidth={6} />
    <path d="M -20 1420 C 180 1360, 360 1450, 600 1400 L 600 1920 L -20 1920 Z" fill="#e59d48" />
  </>
);

export const ColdSide: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky top="#3f6fd6" bottom="#a9d4ff" y1={1300} />
    <Stars t={t} n={30} seed={9} maxY={700} />
    <path d="M 480 1300 L 780 760 L 860 900 L 1100 640 L 1100 1300 Z" fill="#8e9ab8" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 735 840 L 780 760 L 830 850 L 800 830 L 780 860 L 760 830 Z" fill="#fff" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 480 1300 C 700 1230, 900 1320, 1100 1250 L 1100 1920 L 480 1920 Z" fill={C.snow} stroke={OUT} strokeWidth={6} />
    {Array.from({ length: 22 }, (_, i) => {
      const x = 540 + rand(i + 50) * 540;
      const y = ((rand(i + 80) * 1900 + t * (70 + rand(i) * 60)) % 1900) - 20;
      return <circle key={i} cx={x} cy={y} r={4 + rand(i + 3) * 4} fill="#fff" opacity={0.9} />;
    })}
  </>
);
