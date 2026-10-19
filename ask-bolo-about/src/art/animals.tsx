import React from "react";
import { tr } from "../engine/anim";
import { C } from "../engine/theme";

const OUT = C.ink;
const SW = 6;

type P = { x: number; y: number; s?: number; r?: number; t?: number; flip?: boolean; opacity?: number };

const place = (x: number, y: number, s: number, r: number, flip?: boolean) => `${tr(x, y, s, r)} scale(${flip ? -1 : 1} 1)`;

const Eye: React.FC<{ x: number; y: number; r?: number; ring?: string }> = ({ x, y, r = 12, ring = "#fff" }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={ring} stroke={OUT} strokeWidth={4} />
    <circle cx={x} cy={y} r={r * 0.45} fill={OUT} />
    <circle cx={x - r * 0.2} cy={y - r * 0.25} r={r * 0.16} fill="#fff" />
  </g>
);

/** The reference video's owl. */
export const Owl: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, opacity = 1 }) => (
  <g transform={tr(x, y + Math.sin(t * 2) * 4, s, r)} opacity={opacity}>
    <path d="M -80 -40 L -70 -120 L -30 -95 L 30 -95 L 70 -120 L 80 -40 Q 90 40 0 50 Q -90 40 -80 -40 Z" fill="#6b4a36" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <ellipse cx={0} cy={10} rx={48} ry={34} fill="#8a6650" />
    <circle cx={-32} cy={-48} r={26} fill="#f6d36a" stroke={OUT} strokeWidth={5} />
    <circle cx={32} cy={-48} r={26} fill="#f6d36a" stroke={OUT} strokeWidth={5} />
    <circle cx={-32 + Math.sin(t) * 4} cy={-48} r={10} fill={OUT} />
    <circle cx={32 + Math.sin(t) * 4} cy={-48} r={10} fill={OUT} />
    <path d="M -10 -24 L 10 -24 L 0 -6 Z" fill="#ffb02e" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

export const Squirrel: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y + Math.abs(Math.sin(t * 3)) * -6, s, r, flip)} opacity={opacity}>
    <path d="M 40 -20 C 120 -40, 130 -160, 70 -190 C 40 -205, 10 -180, 30 -150 C 60 -120, 50 -70, 20 -50 Z" fill="#c26a2e" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <ellipse cx={-10} cy={-50} rx={48} ry={52} fill="#d77e3c" stroke={OUT} strokeWidth={SW} />
    <ellipse cx={-14} cy={-36} rx={24} ry={30} fill="#f3c9a0" />
    <circle cx={-30} cy={-120} r={38} fill="#d77e3c" stroke={OUT} strokeWidth={SW} />
    <path d="M -50 -150 L -48 -180 L -30 -156 Z M -16 -152 L -6 -180 L 0 -150 Z" fill="#d77e3c" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <Eye x={-42} y={-124} r={10} />
    <circle cx={-66} cy={-108} r={6} fill={OUT} />
    <ellipse cx={-36} cy={0} rx={20} ry={9} fill="#c26a2e" stroke={OUT} strokeWidth={4} />
    <ellipse cx={14} cy={0} rx={20} ry={9} fill="#c26a2e" stroke={OUT} strokeWidth={4} />
  </g>
);

export const Bird: React.FC<P & { color?: string }> = ({ x, y, s = 1, r = 0, t = 0, flip, color = "#4fa3ff", opacity = 1 }) => {
  const flap = Math.sin(t * 14) * 25;
  return (
    <g transform={place(x, y, s, r, flip)} opacity={opacity}>
      <ellipse cx={0} cy={0} rx={56} ry={46} fill={color} stroke={OUT} strokeWidth={SW} />
      <ellipse cx={-6} cy={14} rx={30} ry={22} fill="#fff" opacity={0.6} />
      <path d={`M 10 -6 Q 50 ${-30 - flap} 70 ${-10 - flap} Q 48 10 10 10 Z`} fill={color} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -54 -8 L -84 0 L -54 10 Z" fill="#ffb02e" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <Eye x={-26} y={-14} r={10} />
      <path d="M 50 4 L 78 -8 L 74 18 Z" fill={color} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -10 44 L -14 62 M 12 44 L 14 62" stroke="#ffb02e" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

export const Bee: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => {
  const w = Math.abs(Math.sin(t * 40)) * 0.7 + 0.3;
  return (
    <g transform={place(x, y, s, r, flip)} opacity={opacity}>
      <ellipse cx={-6} cy={-34} rx={18} ry={28 * w} fill="#e8f7ff" stroke={OUT} strokeWidth={4} opacity={0.9} transform="rotate(-20 -6 -34)" />
      <ellipse cx={14} cy={-32} rx={16} ry={24 * w} fill="#e8f7ff" stroke={OUT} strokeWidth={4} opacity={0.9} transform="rotate(20 14 -32)" />
      <ellipse rx={44} ry={32} fill="#ffd23f" stroke={OUT} strokeWidth={SW} />
      <path d="M -12 -30 Q -18 0 -12 30 M 10 -31 Q 4 0 10 31" stroke={OUT} strokeWidth={11} fill="none" />
      <path d="M 44 0 L 56 0" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
      <circle cx={-30} cy={-6} r={6} fill={OUT} />
      <path d="M -40 -26 Q -50 -50 -40 -56 M -28 -30 Q -30 -54 -18 -58" stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const PolarBear: React.FC<P & { sad?: boolean }> = ({ x, y, s = 1, r = 0, t = 0, flip, sad, opacity = 1 }) => (
  <g transform={place(x, y + Math.sin(t * 1.5) * 3, s, r, flip)} opacity={opacity}>
    <path d="M -110 0 L -100 -40 Q -110 -110 -20 -120 L 60 -120 Q 120 -116 118 -60 L 120 0 L 86 0 L 84 -30 L 40 -34 L 36 0 L 0 0 L -4 -36 L -50 -36 L -54 0 Z" fill="#f7f9ff" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <circle cx={-100} cy={-120} r={52} fill="#f7f9ff" stroke={OUT} strokeWidth={SW} />
    <circle cx={-130} cy={-160} r={16} fill="#f7f9ff" stroke={OUT} strokeWidth={5} />
    <circle cx={-76} cy={-166} r={16} fill="#f7f9ff" stroke={OUT} strokeWidth={5} />
    <ellipse cx={-130} cy={-104} rx={22} ry={16} fill="#e6eaf5" />
    <circle cx={-142} cy={-110} r={8} fill={OUT} />
    <circle cx={-100} cy={-132} r={7} fill={OUT} />
    <path d={sad ? "M -134 -86 Q -122 -96 -110 -86" : "M -134 -92 Q -122 -82 -110 -92"} stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

export const Penguin: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r + Math.sin(t * 5) * 4, flip)} opacity={opacity}>
    <ellipse cx={0} cy={-80} rx={56} ry={80} fill="#2b2f45" stroke={OUT} strokeWidth={SW} />
    <ellipse cx={0} cy={-66} rx={38} ry={58} fill="#fff" />
    <Eye x={-16} y={-120} r={9} />
    <Eye x={16} y={-120} r={9} />
    <path d="M -12 -104 L 12 -104 L 0 -88 Z" fill="#ffb02e" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -56 -90 Q -84 -50 -66 -30" stroke="#2b2f45" strokeWidth={18} fill="none" strokeLinecap="round" />
    <path d="M 56 -90 Q 84 -50 66 -30" stroke="#2b2f45" strokeWidth={18} fill="none" strokeLinecap="round" />
    <ellipse cx={-20} cy={0} rx={18} ry={8} fill="#ffb02e" stroke={OUT} strokeWidth={4} />
    <ellipse cx={20} cy={0} rx={18} ry={8} fill="#ffb02e" stroke={OUT} strokeWidth={4} />
  </g>
);

export const Fish: React.FC<P & { color?: string }> = ({ x, y, s = 1, r = 0, t = 0, flip, color = "#ff8a2e", opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <path d={`M 30 0 L ${62} ${-22 + Math.sin(t * 10) * 6} L ${62} ${22 + Math.sin(t * 10) * 6} Z`} fill={color} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    <ellipse rx={40} ry={24} fill={color} stroke={OUT} strokeWidth={5} />
    <path d="M -6 -22 Q -2 0 -6 22 M 14 -20 Q 18 0 14 20" stroke="#fff" strokeWidth={7} fill="none" />
    <circle cx={-22} cy={-5} r={5} fill={OUT} />
  </g>
);

export const Crab: React.FC<P> = ({ x, y, s = 1, t = 0, opacity = 1 }) => (
  <g transform={tr(x + Math.sin(t * 3) * 10, y, s)} opacity={opacity}>
    <path d="M -40 -10 L -60 10 M -30 -4 L -46 18 M 40 -10 L 60 10 M 30 -4 L 46 18" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
    <path d="M -38 -30 L -58 -60 M 38 -30 L 58 -60" stroke={OUT} strokeWidth={8} strokeLinecap="round" />
    <circle cx={-60} cy={-66} r={14} fill="#ff6a3d" stroke={OUT} strokeWidth={4} />
    <circle cx={60} cy={-66} r={14} fill="#ff6a3d" stroke={OUT} strokeWidth={4} />
    <ellipse cx={0} cy={-20} rx={46} ry={28} fill="#ff6a3d" stroke={OUT} strokeWidth={5} />
    <circle cx={-12} cy={-46} r={6} fill={OUT} />
    <circle cx={12} cy={-46} r={6} fill={OUT} />
  </g>
);

export const Mouse: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <path d={`M 50 -14 Q 100 ${-10 + Math.sin(t * 4) * 10} 120 -40`} stroke="#c98d8d" strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-30} rx={56} ry={34} fill="#9a7b6a" stroke={OUT} strokeWidth={SW} />
    <circle cx={-34} cy={-70} r={20} fill="#9a7b6a" stroke={OUT} strokeWidth={5} />
    <circle cx={-34} cy={-70} r={10} fill="#e9a9a9" />
    <path d="M -50 -40 Q -90 -36 -84 -16 Q -64 -10 -40 -16" fill="#9a7b6a" stroke={OUT} strokeWidth={5} />
    <circle cx={-86} cy={-20} r={6} fill="#e98a9a" />
    <Eye x={-50} y={-44} r={7} />
  </g>
);

export const Bunny: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <ellipse cx={-20} cy={-150} rx={14} ry={44} fill="#eee" stroke={OUT} strokeWidth={5} transform={`rotate(${-10 + Math.sin(t * 3) * 6} -20 -110)`} />
    <ellipse cx={18} cy={-150} rx={14} ry={44} fill="#eee" stroke={OUT} strokeWidth={5} transform="rotate(12 18 -110)" />
    <ellipse cx={0} cy={-40} rx={52} ry={44} fill="#f2f2f2" stroke={OUT} strokeWidth={SW} />
    <circle cx={0} cy={-96} r={40} fill="#f2f2f2" stroke={OUT} strokeWidth={SW} />
    <Eye x={-14} y={-100} r={8} />
    <Eye x={14} y={-100} r={8} />
    <path d="M -6 -82 L 6 -82 L 0 -76 Z" fill="#f08aa0" />
  </g>
);

export const Sauropod: React.FC<P & { color?: string }> = ({ x, y, s = 1, r = 0, t = 0, flip, color = "#6cc070", opacity = 1 }) => {
  const nod = Math.sin(t * 1.2) * 4;
  const step = Math.sin(t * 4) * 6;
  return (
    <g transform={place(x, y, s, r, flip)} opacity={opacity}>
      <path d="M 120 -150 Q 260 -150 300 -90 Q 250 -120 140 -100 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      {[-80, -30, 60, 110].map((lx, i) => (
        <rect key={i} x={lx - 18} y={-90} width={38} height={90} rx={12} fill={color} stroke={OUT} strokeWidth={SW} transform={`rotate(${i % 2 ? step : -step} ${lx} -90)`} />
      ))}
      <ellipse cx={20} cy={-130} rx={150} ry={80} fill={color} stroke={OUT} strokeWidth={SW} />
      <path d={`M -100 -150 Q -170 -260 ${-150 + nod} -380 L ${-110 + nod} -385 Q -120 -260 -40 -190 Z`} fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={-150 + nod} cy={-395} rx={50} ry={30} fill={color} stroke={OUT} strokeWidth={SW} />
      <circle cx={-162 + nod} cy={-402} r={7} fill={OUT} />
      <path d={`M ${-190 + nod} -385 Q ${-175 + nod} -375 ${-160 + nod} -382`} stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
      {[-30, 30, 90].map((sx) => (
        <circle key={sx} cx={sx} cy={-170} r={12} fill="#4fa055" />
      ))}
    </g>
  );
};

export const TRex: React.FC<P & { color?: string }> = ({ x, y, s = 1, r = 0, t = 0, flip, color = "#e0874a", opacity = 1 }) => {
  const jaw = Math.max(0, Math.sin(t * 3)) * 10;
  return (
    <g transform={place(x, y, s, r, flip)} opacity={opacity}>
      <path d="M 60 -150 Q 200 -140 260 -60 Q 180 -110 70 -100 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 10 -90 L 0 0 L 50 0 L 60 -90 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={30} cy={-150} rx={90} ry={70} fill={color} stroke={OUT} strokeWidth={SW} />
      <path d="M 80 -190 Q 100 -260 60 -300 L -60 -300 Q -100 -280 -90 -250 L 10 -240 Q 40 -230 40 -180 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M 30 -240 L -80 ${-232 + jaw} Q -70 ${-206 + jaw} 0 ${-206 + jaw} Z`} fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 0 -245 L -8 -235 L -16 -245 L -24 -235 L -32 -245 L -40 -235 L -48 -245" stroke="#fff" strokeWidth={4} fill="none" />
      <Eye x={-20} y={-275} r={11} />
      <path d="M -40 -150 Q -75 -140 -70 -112 M -30 -128 Q -60 -114 -52 -94" stroke={OUT} strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d="M -40 -150 Q -75 -140 -70 -112 M -30 -128 Q -60 -114 -52 -94" stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" />
    </g>
  );
};
