import React from "react";
import { rand, tr } from "../engine/anim";
import { C } from "../engine/theme";

const OUT = C.ink;
const SW = 6;

type P = { x: number; y: number; s?: number; r?: number; t?: number; flip?: boolean; opacity?: number };

const place = (x: number, y: number, s: number, r: number, flip?: boolean) => `${tr(x, y, s, r)} scale(${flip ? -1 : 1} 1)`;

const Eye: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 10 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#fff" stroke={OUT} strokeWidth={4} />
    <circle cx={x} cy={y} r={r * 0.45} fill={OUT} />
  </g>
);

export const Volcano: React.FC<{ x: number; y: number; t: number; s?: number; erupt?: number }> = ({ x, y, t, s = 1, erupt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => {
      const p = (t * (0.3 + erupt * 0.3) + i / 4) % 1;
      const r = (40 + p * 50) * (1 + erupt * 1.5);
      return <circle key={i} cx={Math.sin(i + t) * 20 * (1 + erupt)} cy={-380 - p * (260 + erupt * 400)} r={r} fill={erupt > 0.3 ? "#4a4248" : "#6b5d66"} opacity={0.65 * (1 - p)} />;
    })}
    <path d="M -300 0 L -80 -380 L 80 -380 L 300 0 Z" fill="#7a5a4a" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -80 -380 L 80 -380 L 60 -330 L 20 -350 L -10 -310 L -40 -350 L -70 -330 Z" fill="#ff7a2f" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    {erupt > 0 ? (
      <g opacity={erupt}>
        <path d="M -30 -380 Q -60 -250 -120 -60 L -80 -60 Q -30 -250 0 -380 Z" fill="#ff5a1f" stroke={OUT} strokeWidth={4} />
        <path d="M 20 -380 Q 70 -220 140 -40 L 100 -40 Q 40 -220 0 -380 Z" fill="#ff7a2f" stroke={OUT} strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => {
          const p = (t * 0.8 + i / 5) % 1;
          return <circle key={i} cx={(i - 2) * 60 * p} cy={-400 - Math.sin(p * Math.PI) * 220} r={14} fill="#ffb02e" stroke={OUT} strokeWidth={3} />;
        })}
      </g>
    ) : null}
  </g>
);

export const Frog: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => {
  const hop = Math.max(0, Math.sin(t * 4)) * 30;
  return (
    <g transform={place(x, y - hop, s, r, flip)} opacity={opacity}>
      <ellipse cx={0} cy={-50} rx={70} ry={50} fill="#5cc45a" stroke={OUT} strokeWidth={SW} />
      <ellipse cx={-60} cy={-10} rx={34} ry={14} fill="#4aa848" stroke={OUT} strokeWidth={5} />
      <ellipse cx={60} cy={-10} rx={34} ry={14} fill="#4aa848" stroke={OUT} strokeWidth={5} />
      <circle cx={-30} cy={-98} r={24} fill="#5cc45a" stroke={OUT} strokeWidth={5} />
      <circle cx={30} cy={-98} r={24} fill="#5cc45a" stroke={OUT} strokeWidth={5} />
      <Eye x={-30} y={-100} r={12} />
      <Eye x={30} y={-100} r={12} />
      <path d="M -36 -50 Q 0 -26 36 -50" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-36} rx={40} ry={18} fill="#d8f0a8" opacity={0.7} />
    </g>
  );
};

export const Snail: React.FC<P> = ({ x, y, s = 1, r = 0, t = 0, flip, opacity = 1 }) => (
  <g transform={place(x + t * 6, y, s, r, flip)} opacity={opacity}>
    <path d="M -90 0 Q -100 -30 -70 -40 L 60 -30 Q 80 -10 70 0 Z" fill="#f2c9a0" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -80 -38 L -96 -80 M -66 -40 L -70 -84" stroke={OUT} strokeWidth={5} strokeLinecap="round" />
    <circle cx={-96} cy={-84} r={7} fill={OUT} />
    <circle cx={-70} cy={-88} r={7} fill={OUT} />
    <circle cx={10} cy={-60} r={52} fill="#c97a3a" stroke={OUT} strokeWidth={SW} />
    <path d="M 10 -60 m -6 0 a 6 6 0 1 1 12 0 a 16 16 0 1 1 -28 0 a 26 26 0 1 1 46 0" fill="none" stroke="#8a4a1e" strokeWidth={5} />
  </g>
);

export const Mushroom: React.FC<P & { color?: string }> = ({ x, y, s = 1, r = 0, color = "#e8473f", opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M -22 0 L -16 -70 L 16 -70 L 22 0 Z" fill="#f6ecd6" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -80 -60 Q -80 -150 0 -150 Q 80 -150 80 -60 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <circle cx={-34} cy={-104} r={12} fill="#fff" />
    <circle cx={18} cy={-122} r={10} fill="#fff" />
    <circle cx={40} cy={-84} r={8} fill="#fff" />
  </g>
);

export const Bat: React.FC<P> = ({ x, y, s = 1, t = 0, opacity = 1 }) => {
  const f = Math.sin(t * 16) * 18;
  return (
    <g transform={tr(x, y, s)} opacity={opacity}>
      <path d={`M 0 0 Q -40 ${-30 - f} -100 ${-20 - f} Q -80 0 -90 20 Q -60 10 -40 26 Q -20 12 0 20 Q 20 12 40 26 Q 60 10 90 20 Q 80 0 100 ${-20 - f} Q 40 ${-30 - f} 0 0 Z`} fill="#3b2f4a" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={0} cy={6} rx={22} ry={26} fill="#4a3d5c" stroke={OUT} strokeWidth={4} />
      <path d="M -14 -14 L -10 -32 L -2 -16 M 14 -14 L 10 -32 L 2 -16" fill="#4a3d5c" stroke={OUT} strokeWidth={3} />
      <circle cx={-8} cy={0} r={4} fill="#fff" />
      <circle cx={8} cy={0} r={4} fill="#fff" />
    </g>
  );
};

export const Fireflies: React.FC<{ t: number; n?: number; x0?: number; x1?: number; y0?: number; y1?: number; opacity?: number }> = ({
  t,
  n = 12,
  x0 = 80,
  x1 = 1000,
  y0 = 900,
  y1 = 1300,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + rand(i + 3) * (x1 - x0) + Math.sin(t * 1.3 + i) * 30;
      const y = y0 + rand(i + 9) * (y1 - y0) + Math.cos(t * 1.1 + i) * 30;
      const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
      return (
        <g key={i} opacity={glow}>
          <circle cx={x} cy={y} r={18} fill="#fff6a0" opacity={0.35} />
          <circle cx={x} cy={y} r={7} fill="#fff6a0" />
        </g>
      );
    })}
  </g>
);

/** Bird-like wings drawn behind Bolo (place at his shoulders). */
export const Wings: React.FC<P> = ({ x, y, s = 1, t = 0 }) => {
  const f = Math.sin(t * 9) * 22;
  return (
    <g transform={tr(x, y, s)}>
      {[-1, 1].map((d) => (
        <path
          key={d}
          transform={`scale(${d} 1) rotate(${-f})`}
          d="M 60 0 Q 160 -120 290 -90 Q 250 -60 270 -40 Q 220 -30 240 0 Q 180 0 190 30 Q 120 30 60 20 Z"
          fill="#ffffff"
          stroke={OUT}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
};

export const Plane: React.FC<P> = ({ x, y, s = 1, r = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <path d="M -10 -10 L 40 -90 L 70 -90 L 50 -10 Z M -60 -14 L -80 -60 L -60 -60 L -30 -14 Z" fill="#cfd8e6" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -110 -20 Q -110 -40 -80 -40 L 120 -40 Q 160 -30 160 -10 Q 160 10 120 10 L -80 10 Q -110 10 -110 -20 Z" fill="#fff" stroke={OUT} strokeWidth={SW} />
    {[-40, -10, 20, 50, 80].map((wx) => (
      <circle key={wx} cx={wx} cy={-16} r={8} fill="#7fd0ff" stroke={OUT} strokeWidth={3} />
    ))}
    <path d="M 10 0 L 60 60 L 90 60 L 60 0 Z" fill="#cfd8e6" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

export const Dolphin: React.FC<P> = ({ x, y, s = 1, r = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <path d="M -150 10 Q -120 -60 0 -60 Q 100 -60 140 -10 L 190 -30 L 175 10 L 200 40 L 140 20 Q 60 50 -60 40 Q -110 36 -150 10 Z" fill="#7aa7d6" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -10 -60 L 20 -110 L 50 -58 Z" fill="#7aa7d6" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -140 18 Q -80 40 0 34" fill="none" stroke="#dbe9f7" strokeWidth={14} strokeLinecap="round" />
    <circle cx={-100} cy={-14} r={7} fill={OUT} />
  </g>
);

export const Seal: React.FC<P> = ({ x, y, s = 1, r = 0, flip, opacity = 1 }) => (
  <g transform={place(x, y, s, r, flip)} opacity={opacity}>
    <path d="M -120 0 Q -110 -90 -40 -120 Q 20 -130 40 -80 Q 80 -10 160 -10 L 200 -40 L 190 0 L 200 30 L 150 10 Q 60 20 -120 0 Z" fill="#9aa3b5" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <circle cx={-50} cy={-100} r={8} fill={OUT} />
    <ellipse cx={-90} cy={-82} rx={12} ry={8} fill={OUT} />
    <path d="M -100 -78 L -130 -86 M -100 -74 L -130 -70" stroke={OUT} strokeWidth={3} />
    <path d="M -30 -20 Q -20 30 20 20" fill="#8a93a5" stroke={OUT} strokeWidth={5} />
  </g>
);

export const House: React.FC<P & { color?: string; smoke?: boolean }> = ({ x, y, s = 1, t = 0, color = "#e8a87c", smoke, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    {smoke
      ? [0, 1, 2].map((i) => {
          const p = (t * 0.4 + i / 3) % 1;
          return <circle key={i} cx={90 + Math.sin(t + i) * 12} cy={-300 - p * 200} r={20 + p * 30} fill="#cfd4dc" opacity={0.8 * (1 - p)} />;
        })
      : null}
    <rect x={70} y={-300} width={44} height={90} fill="#a35a3a" stroke={OUT} strokeWidth={5} />
    <rect x={-150} y={-190} width={300} height={190} fill={color} stroke={OUT} strokeWidth={SW} />
    <path d="M -180 -180 L 0 -320 L 180 -180 Z" fill="#c2453a" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-40} y={-110} width={80} height={110} rx={8} fill="#8a5a32" stroke={OUT} strokeWidth={5} />
    <rect x={-120} y={-150} width={60} height={60} rx={6} fill="#ffe680" stroke={OUT} strokeWidth={5} />
    <rect x={60} y={-150} width={60} height={60} rx={6} fill="#ffe680" stroke={OUT} strokeWidth={5} />
  </g>
);

export const Greenhouse: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path d="M -220 0 L -220 -160 Q 0 -330 220 -160 L 220 0 Z" fill="#c9f0e0" fillOpacity={0.7} stroke={OUT} strokeWidth={SW} />
    <path d="M -110 0 L -110 -240 M 0 0 L 0 -255 M 110 0 L 110 -240 M -220 -160 L 220 -160" stroke={OUT} strokeWidth={4} />
    {[-160, -60, 50, 160].map((px) => (
      <g key={px}>
        <path d={`M ${px} 0 L ${px} -50`} stroke="#3aa64a" strokeWidth={6} />
        <circle cx={px} cy={-60} r={18} fill={C.leaf} stroke={OUT} strokeWidth={4} />
        <circle cx={px + 14} cy={-40} r={10} fill="#e8473f" stroke={OUT} strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const Hoop: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <rect x={-10} y={-600} width={20} height={600} fill="#7a7f8c" stroke={OUT} strokeWidth={5} />
    <rect x={-110} y={-760} width={160} height={120} rx={8} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <rect x={-70} y={-720} width={80} height={60} fill="none" stroke={C.red} strokeWidth={6} />
    <ellipse cx={-30} cy={-640} rx={60} ry={12} fill="none" stroke="#ff7a2f" strokeWidth={8} />
    <path d="M -86 -636 L -60 -570 L 0 -570 L 26 -636" fill="none" stroke="#fff" strokeWidth={4} />
  </g>
);

export const TrafficLight: React.FC<P & { color?: "red" | "yellow" | "green" }> = ({ x, y, s = 1, color = "red", opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <rect x={-45} y={-140} width={90} height={250} rx={20} fill="#2b2f45" stroke={OUT} strokeWidth={SW} />
    {(["red", "yellow", "green"] as const).map((c, i) => (
      <circle
        key={c}
        cx={0}
        cy={-95 + i * 75}
        r={28}
        fill={color === c ? { red: "#ff4a3d", yellow: "#ffd23f", green: "#4cd264" }[c] : "#555b70"}
        stroke={OUT}
        strokeWidth={4}
      />
    ))}
  </g>
);

export const Bear: React.FC<P & { sleeping?: boolean }> = ({ x, y, s = 1, t = 0, sleeping, opacity = 1 }) => (
  <g transform={tr(x, y + (sleeping ? Math.sin(t * 2) * 3 : 0), s)} opacity={opacity}>
    <ellipse cx={0} cy={-70} rx={150} ry={80} fill="#8a5a32" stroke={OUT} strokeWidth={SW} />
    <circle cx={-140} cy={-110} r={60} fill="#8a5a32" stroke={OUT} strokeWidth={SW} />
    <circle cx={-170} cy={-160} r={20} fill="#8a5a32" stroke={OUT} strokeWidth={5} />
    <circle cx={-110} cy={-166} r={20} fill="#8a5a32" stroke={OUT} strokeWidth={5} />
    <ellipse cx={-170} cy={-92} rx={26} ry={18} fill="#c99a6a" />
    <circle cx={-182} cy={-100} r={7} fill={OUT} />
    {sleeping ? (
      <path d="M -160 -124 q 10 8 20 0 M -124 -128 q 10 8 20 0" stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
    ) : (
      <>
        <circle cx={-148} cy={-126} r={7} fill={OUT} />
        <circle cx={-114} cy={-128} r={7} fill={OUT} />
      </>
    )}
  </g>
);

export const Snowman: React.FC<P> = ({ x, y, s = 1, t = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, Math.sin(t * 1.5) * 2)} opacity={opacity}>
    <circle cx={0} cy={-80} r={80} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <circle cx={0} cy={-210} r={60} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <circle cx={-20} cy={-224} r={7} fill={OUT} />
    <circle cx={20} cy={-224} r={7} fill={OUT} />
    <path d="M 0 -210 L 50 -200 L 0 -196 Z" fill="#ff8a2e" stroke={OUT} strokeWidth={3} />
    <path d="M -60 -160 Q 0 -140 60 -160 L 60 -146 Q 0 -126 -60 -146 Z" fill={C.red} stroke={OUT} strokeWidth={4} />
    <rect x={-50} y={-310} width={100} height={20} fill="#2b2f45" stroke={OUT} strokeWidth={4} />
    <rect x={-34} y={-370} width={68} height={64} fill="#2b2f45" stroke={OUT} strokeWidth={4} />
    {[-110, -80, -50].map((by) => (
      <circle key={by} cx={0} cy={by} r={7} fill={OUT} />
    ))}
  </g>
);

export const Algae: React.FC<P & { t: number; grow?: number }> = ({ x, y, s = 1, t, grow = 1 }) => (
  <g transform={tr(x, y, s)}>
    {Array.from({ length: 7 }, (_, i) => {
      const dx = (i - 3) * 22;
      const h = (80 + rand(i + x) * 120) * grow;
      return (
        <path
          key={i}
          d={`M ${dx} 0 Q ${dx + Math.sin(t * 2 + i) * 18} ${-h / 2} ${dx + Math.sin(t * 2 + i + 1) * 14} ${-h}`}
          fill="none"
          stroke={i % 2 ? "#4f9a2e" : "#6cbf3a"}
          strokeWidth={14}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

export const Plate: React.FC<P & { empty?: boolean }> = ({ x, y, s = 1, empty, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={180} ry={60} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <ellipse cx={0} cy={0} rx={120} ry={36} fill="#f2f2f2" stroke="#ccc" strokeWidth={4} />
    {empty ? null : (
      <g transform="translate(0 -14)">
        <path d="M 40 0 L 80 -22 L 80 22 Z" fill="#f2b06a" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
        <ellipse rx={60} ry={26} fill="#f2b06a" stroke={OUT} strokeWidth={5} />
        <circle cx={-34} cy={-6} r={5} fill={OUT} />
      </g>
    )}
  </g>
);
