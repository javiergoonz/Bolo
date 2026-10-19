import React from "react";
import { rand, tr } from "../engine/anim";
import { C, FONT } from "../engine/theme";

const OUT = C.ink;
const SW = 6;

type P = { x: number; y: number; s?: number; r?: number; t?: number; opacity?: number };

export const SvgText: React.FC<{
  x: number;
  y: number;
  size: number;
  children: string;
  color?: string;
  stroke?: string;
  anchor?: "start" | "middle" | "end";
  rotate?: number;
  opacity?: number;
}> = ({ x, y, size, children, color = "#fff", stroke = OUT, anchor = "middle", rotate = 0, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
    <text
      textAnchor={anchor}
      fontFamily={FONT}
      fontSize={size}
      fill={stroke}
      stroke={stroke}
      strokeWidth={size * 0.2}
      strokeLinejoin="round"
      transform={`translate(0 ${size * 0.07})`}
    >
      {children}
    </text>
    <text textAnchor={anchor} fontFamily={FONT} fontSize={size} fill={stroke} stroke={stroke} strokeWidth={size * 0.2} strokeLinejoin="round">
      {children}
    </text>
    <text textAnchor={anchor} fontFamily={FONT} fontSize={size} fill={color}>
      {children}
    </text>
  </g>
);

export const QuestionMark: React.FC<P> = ({ x, y, s = 1, t = 0, opacity = 1 }) => (
  <SvgText x={x} y={y + Math.sin(t * 3 + x) * 10} size={90 * s} color={C.yellow} rotate={Math.sin(t * 2 + x) * 10} opacity={opacity}>
    ?
  </SvgText>
);

export const Cross: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path d="M -90 -90 L 90 90 M 90 -90 L -90 90" stroke={OUT} strokeWidth={46} strokeLinecap="round" />
    <path d="M -90 -90 L 90 90 M 90 -90 L -90 90" stroke={C.red} strokeWidth={28} strokeLinecap="round" />
  </g>
);

export const Check: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <path d="M -80 0 L -20 60 L 90 -70" stroke={OUT} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M -80 0 L -20 60 L 90 -70" stroke="#4cd264" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>
);

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; opacity?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color = C.yellow,
  w = 16,
  opacity = 1,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = w * 2.6;
  const hx = x2 - Math.cos(a) * h * 0.8;
  const hy = y2 - Math.sin(a) * h * 0.8;
  const p1 = [x2 - Math.cos(a - 0.6) * h, y2 - Math.sin(a - 0.6) * h];
  const p2 = [x2 - Math.cos(a + 0.6) * h, y2 - Math.sin(a + 0.6) * h];
  return (
    <g opacity={opacity}>
      <path d={`M ${x1} ${y1} L ${hx} ${hy}`} stroke={OUT} strokeWidth={w + 12} strokeLinecap="round" />
      <path d={`M ${x2} ${y2} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={color} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${x1} ${y1} L ${hx} ${hy}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
};

/** Dotted path that draws itself from 0..1 (like the reference coral-to-moon dots). */
export const DotPath: React.FC<{ d: [number, number][]; progress: number; color?: string; r?: number; n?: number }> = ({
  d,
  progress,
  color = "#ffc2d6",
  r = 7,
  n = 18,
}) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    if (u > progress) break;
    const seg = u * (d.length - 1);
    const k = Math.min(d.length - 2, Math.floor(seg));
    const f = seg - k;
    pts.push([d[k][0] + (d[k + 1][0] - d[k][0]) * f, d[k][1] + (d[k + 1][1] - d[k][1]) * f]);
  }
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={color} stroke={OUT} strokeWidth={2.5} />
      ))}
    </g>
  );
};

export const Building: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number; lit?: boolean }> = ({
  x,
  y,
  w,
  h,
  color = "#7f8fb3",
  opacity = 1,
  lit = false,
}) => {
  const cols = Math.max(2, Math.floor(w / 46));
  const rows = Math.max(2, Math.floor(h / 62));
  return (
    <g opacity={opacity}>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={color} stroke={OUT} strokeWidth={SW} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x - w / 2 + (w / cols) * c + w / cols / 2 - 12}
            y={y - h + 26 + r * ((h - 40) / rows)}
            width={24}
            height={30}
            rx={4}
            fill={lit && rand(r * 13 + c + x) > 0.4 ? "#ffe680" : "#cfe6ff"}
            stroke={OUT}
            strokeWidth={3}
          />
        )),
      )}
    </g>
  );
};

export const City: React.FC<{ y: number; opacity?: number; lit?: boolean; scale?: number }> = ({ y, opacity = 1, lit, scale = 1 }) => (
  <g opacity={opacity} transform={`translate(540 ${y}) scale(${scale}) translate(-540 ${-y})`}>
    <Building x={110} y={y} w={170} h={420} color="#8a7fb3" lit={lit} />
    <Building x={300} y={y} w={190} h={620} color="#6f86b8" lit={lit} />
    <Building x={500} y={y} w={170} h={360} color="#b38a7f" lit={lit} />
    <Building x={690} y={y} w={200} h={540} color="#7fa3b3" lit={lit} />
    <Building x={900} y={y} w={190} h={440} color="#9a8fc2" lit={lit} />
  </g>
);

export const Car: React.FC<P & { wheel?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, wheel = 0, color = "#e8473f", flip, opacity = 1 }) => (
  <g transform={`${tr(x, y, s)} scale(${flip ? -1 : 1} 1)`} opacity={opacity}>
    <path d="M -150 -40 L -150 -90 Q -150 -110 -120 -110 L -80 -110 L -40 -170 L 70 -170 L 110 -110 L 140 -110 Q 160 -110 160 -80 L 160 -40 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -30 -155 L 0 -155 L 0 -112 L -60 -112 Z M 15 -155 L 62 -155 L 90 -112 L 15 -112 Z" fill="#cfe6ff" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    {[-90, 100].map((wx) => (
      <g key={wx} transform={`translate(${wx} -40) rotate(${wheel})`}>
        <circle r={40} fill="#333" stroke={OUT} strokeWidth={SW} />
        <circle r={18} fill="#ccc" stroke={OUT} strokeWidth={4} />
        <path d="M -18 0 L 18 0 M 0 -18 L 0 18" stroke={OUT} strokeWidth={4} />
      </g>
    ))}
    <circle cx={150} cy={-90} r={9} fill="#ffe680" stroke={OUT} strokeWidth={3} />
  </g>
);

export const Rocket: React.FC<P & { flame?: number; color?: string }> = ({ x, y, s = 1, r = 0, t = 0, flame = 1, color = "#f2f4f8", opacity = 1 }) => {
  const f = flame * (1 + Math.sin(t * 40) * 0.15);
  return (
    <g transform={tr(x, y, s, r)} opacity={opacity}>
      {flame > 0 ? (
        <g>
          <path d={`M -36 60 Q 0 ${60 + 200 * f} 36 60 Z`} fill="#ff9a2e" stroke={OUT} strokeWidth={5} />
          <path d={`M -20 60 Q 0 ${60 + 120 * f} 20 60 Z`} fill="#ffe14a" />
        </g>
      ) : null}
      <path d="M -50 40 L -90 90 L -40 70 Z M 50 40 L 90 90 L 40 70 Z" fill={C.red} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 0 -180 Q 60 -110 50 70 L -50 70 Q -60 -110 0 -180 Z" fill={color} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M -26 -120 Q 0 -170 26 -120 Z" fill={C.red} stroke={OUT} strokeWidth={5} />
      <circle cx={0} cy={-50} r={24} fill="#7fd0ff" stroke={OUT} strokeWidth={SW} />
    </g>
  );
};

export const Satellite: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <rect x={-150} y={-30} width={100} height={60} fill="#3f6fd6" stroke={OUT} strokeWidth={SW} />
    <rect x={50} y={-30} width={100} height={60} fill="#3f6fd6" stroke={OUT} strokeWidth={SW} />
    <path d="M -100 -30 L -100 30 M 100 -30 L 100 30" stroke={OUT} strokeWidth={3} />
    <rect x={-50} y={-45} width={100} height={90} rx={10} fill="#d9dde6" stroke={OUT} strokeWidth={SW} />
    <circle cx={0} cy={-60} r={14} fill="#ffe14a" stroke={OUT} strokeWidth={4} />
  </g>
);

export const Asteroid: React.FC<P & { trail?: number; spin?: number }> = ({ x, y, s = 1, r = 0, spin = 0, trail = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    {trail > 0 ? (
      <g opacity={trail}>
        <path d="M 40 -60 L 420 -200 L 430 -170 L 60 30 Z" fill="#ff9a2e" opacity={0.55} />
        <path d="M 40 -30 L 360 -150 L 365 -130 L 50 10 Z" fill="#ffe14a" opacity={0.7} />
      </g>
    ) : null}
    <g transform={`rotate(${spin})`}>
      <path d="M -70 -20 Q -60 -80 0 -80 Q 70 -82 80 -10 Q 86 60 10 74 Q -66 76 -70 -20 Z" fill="#8a7b70" stroke={OUT} strokeWidth={SW} />
      <circle cx={-20} cy={-20} r={16} fill="#6e6158" stroke={OUT} strokeWidth={3} />
      <circle cx={30} cy={24} r={11} fill="#6e6158" stroke={OUT} strokeWidth={3} />
      <circle cx={34} cy={-38} r={8} fill="#6e6158" />
    </g>
  </g>
);

export const Rock: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M -30 -8 Q -26 -30 0 -30 Q 28 -32 32 -6 Q 34 20 4 26 Q -30 28 -30 -8 Z" fill="#b8c2d6" stroke={OUT} strokeWidth={4} />
  </g>
);

export const Thermometer: React.FC<P & { level: number; hot?: boolean }> = ({ x, y, s = 1, level, hot = true, opacity = 1 }) => {
  const col = hot ? C.red : "#4aa8ff";
  const h = 360;
  return (
    <g transform={tr(x, y, s)} opacity={opacity}>
      <rect x={-34} y={-h} width={68} height={h} rx={34} fill="#fff" stroke={OUT} strokeWidth={SW} />
      <rect x={-16} y={-h + 20 + (h - 60) * (1 - level)} width={32} height={(h - 60) * level + 40} rx={16} fill={col} />
      <circle cx={0} cy={30} r={60} fill={col} stroke={OUT} strokeWidth={SW} />
      <rect x={-34} y={-h} width={68} height={h - 30} rx={34} fill="none" stroke={OUT} strokeWidth={SW} />
      {[0.2, 0.4, 0.6, 0.8].map((k) => (
        <path key={k} d={`M 34 ${-h + 20 + (h - 60) * k} L 54 ${-h + 20 + (h - 60) * k}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
      ))}
    </g>
  );
};

export const Hourglass: React.FC<P & { progress: number }> = ({ x, y, s = 1, r = 0, progress, opacity = 1 }) => {
  const top = 1 - progress;
  return (
    <g transform={tr(x, y, s, r)} opacity={opacity}>
      <rect x={-110} y={-200} width={220} height={26} rx={10} fill={C.trunk} stroke={OUT} strokeWidth={SW} />
      <rect x={-110} y={174} width={220} height={26} rx={10} fill={C.trunk} stroke={OUT} strokeWidth={SW} />
      <path d="M -90 -174 L 90 -174 Q 90 -60 12 0 Q 90 60 90 174 L -90 174 Q -90 60 -12 0 Q -90 -60 -90 -174 Z" fill="#e9f6ff" stroke={OUT} strokeWidth={SW} />
      <path d={`M ${-80 * top} ${-20 - 140 * top} L ${80 * top} ${-20 - 140 * top} L 0 -10 Z`} fill="#f2c04e" />
      <path d={`M -82 168 L 82 168 L ${60 * (1 - progress) + 10} ${168 - 140 * progress} L ${-60 * (1 - progress) - 10} ${168 - 140 * progress} Z`} fill="#f2c04e" />
      <path d="M 0 -6 L 0 168" stroke="#f2c04e" strokeWidth={6} opacity={progress < 1 ? 1 : 0} />
    </g>
  );
};

export const BathScale: React.FC<P & { value: string }> = ({ x, y, s = 1, value, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <rect x={-160} y={-50} width={320} height={60} rx={22} fill="#e9eef7" stroke={OUT} strokeWidth={SW} />
    {value ? (
      <>
        <rect x={-70} y={-160} width={140} height={90} rx={14} fill="#1b2a3a" stroke={OUT} strokeWidth={SW} />
        <SvgText x={0} y={-95} size={56} color="#7dffb0">
          {value}
        </SvgText>
      </>
    ) : null}
  </g>
);

export const Pencil: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M -120 -16 L 80 -16 L 120 0 L 80 16 L -120 16 Z" fill="#ffd23f" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M 80 -16 L 120 0 L 80 16 Z" fill="#f3c9a0" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 108 -5 L 120 0 L 108 5 Z" fill={OUT} />
    <rect x={-150} y={-16} width={32} height={32} rx={6} fill="#ff9ab0" stroke={OUT} strokeWidth={5} />
  </g>
);

export const Paintbrush: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <rect x={-8} y={-110} width={16} height={100} rx={6} fill={C.trunk} stroke={OUT} strokeWidth={4} />
    <rect x={-12} y={-16} width={24} height={20} fill="#c0c6d2" stroke={OUT} strokeWidth={4} />
    <path d="M -12 4 Q -14 40 0 46 Q 14 40 12 4 Z" fill="#ffd23f" stroke={OUT} strokeWidth={4} />
  </g>
);

export const Board: React.FC<P & { out?: number }> = ({ x, y, s = 1, out = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <rect x={-260} y={-60} width={520} height={120} rx={10} fill="#d9a46a" stroke={OUT} strokeWidth={SW} />
    <path d="M -240 -20 L 240 -20 M -240 25 L 240 25" stroke="#b9844e" strokeWidth={5} />
    {[-180, 0, 180].map((sx, i) => {
      const o = out * (1 + i * 0.4) * 120;
      return (
        <g key={sx} transform={`translate(${sx} ${-o * 0.2}) rotate(${-o * 0.8})`} opacity={out > 0.9 ? 0.9 : 1}>
          <rect x={-8} y={-o - 10} width={16} height={60} fill="#aab2c2" stroke={OUT} strokeWidth={3} />
          <circle cx={0} cy={-o - 14} r={18} fill="#c7cede" stroke={OUT} strokeWidth={4} />
          <path d={`M -10 ${-o - 14} L 10 ${-o - 14}`} stroke={OUT} strokeWidth={4} />
        </g>
      );
    })}
  </g>
);

export const Apple: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M 0 -50 C 40 -80, 80 -40, 66 10 C 56 50, 20 70, 0 56 C -20 70, -56 50, -66 10 C -80 -40, -40 -80, 0 -50 Z" fill="#e8473f" stroke={OUT} strokeWidth={SW} />
    <path d="M 0 -50 Q 4 -76 14 -86" stroke={OUT} strokeWidth={6} strokeLinecap="round" fill="none" />
    <path d="M 8 -70 Q 36 -92 50 -70 Q 30 -56 8 -70 Z" fill={C.leaf} stroke={OUT} strokeWidth={4} />
    <ellipse cx={-30} cy={-20} rx={10} ry={18} fill="#fff" opacity={0.35} />
  </g>
);

export const Blueberry: React.FC<P> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    {[
      [-26, 10],
      [26, 12],
      [0, -26],
    ].map(([bx, by], i) => (
      <g key={i}>
        <circle cx={bx} cy={by} r={30} fill="#4b5fd1" stroke={OUT} strokeWidth={5} />
        <path d={`M ${bx - 8} ${by - 22} L ${bx} ${by - 14} L ${bx + 8} ${by - 22}`} stroke="#2c3a8a" strokeWidth={4} fill="none" />
      </g>
    ))}
  </g>
);

export const Almond: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M 0 -60 C 40 -40, 44 30, 0 56 C -44 30, -40 -40, 0 -60 Z" fill="#c98b4b" stroke={OUT} strokeWidth={SW} />
    <path d="M -10 -30 Q -16 0 -8 30 M 10 -20 Q 14 6 8 26" stroke="#a46a34" strokeWidth={4} fill="none" />
  </g>
);

export const HoneyJar: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <rect x={-70} y={-150} width={140} height={34} rx={10} fill="#c26a2e" stroke={OUT} strokeWidth={SW} />
    <path d="M -80 -116 L 80 -116 Q 96 -40 80 0 L -80 0 Q -96 -40 -80 -116 Z" fill="#ffb02e" stroke={OUT} strokeWidth={SW} />
    <rect x={-50} y={-90} width={100} height={60} rx={8} fill="#fff6d6" stroke={OUT} strokeWidth={4} />
    <SvgText x={0} y={-46} size={34} color="#c26a2e" stroke="#fff6d6">
      HONEY
    </SvgText>
  </g>
);

export const PriceTag: React.FC<P & { text: string }> = ({ x, y, s = 1, r = 0, text, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <path d="M -90 -40 L 60 -40 L 100 0 L 60 40 L -90 40 Z" fill="#fff" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <circle cx={64} cy={0} r={8} fill="none" stroke={OUT} strokeWidth={4} />
    <SvgText x={-14} y={18} size={50} color={C.red} stroke="#fff">
      {text}
    </SvgText>
  </g>
);

export const Hurricane: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    {[0, 120, 240].map((a) => (
      <path
        key={a}
        d="M 0 0 C 60 -20, 120 -10, 160 50 C 120 20, 70 20, 30 40"
        fill="#e8f2ff"
        stroke={OUT}
        strokeWidth={SW}
        strokeLinejoin="round"
        transform={`rotate(${a})`}
      />
    ))}
    <circle r={40} fill="#e8f2ff" stroke={OUT} strokeWidth={SW} />
    <circle r={14} fill="#7aa8d8" />
  </g>
);

export const Calendar: React.FC<P & { page: string }> = ({ x, y, s = 1, r = 0, page, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <rect x={-110} y={-110} width={220} height={230} rx={18} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <path d="M -110 -50 L 110 -50 L 110 -92 Q 110 -110 92 -110 L -92 -110 Q -110 -110 -110 -92 Z" fill={C.red} stroke={OUT} strokeWidth={SW} />
    <SvgText x={0} y={80} size={110} color={C.ink} stroke="#fff">
      {page}
    </SvgText>
  </g>
);

export const Ball: React.FC<P> = ({ x, y, s = 1, r = 0, opacity = 1 }) => (
  <g transform={tr(x, y, s, r)} opacity={opacity}>
    <circle r={60} fill="#ff6a3d" stroke={OUT} strokeWidth={SW} />
    <path d="M -60 0 Q 0 -30 60 0 M 0 -60 Q -26 0 0 60" stroke="#fff" strokeWidth={8} fill="none" />
  </g>
);

export const MolBubble: React.FC<P & { label: string; color?: string }> = ({ x, y, s = 1, label, color = "#bfefff", opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <circle r={62} fill={color} fillOpacity={0.55} stroke={OUT} strokeWidth={5} />
    <circle cx={-22} cy={-24} r={10} fill="#fff" opacity={0.8} />
    <SvgText x={0} y={18} size={52} color="#fff">
      {label}
    </SvgText>
  </g>
);

export const Ruler: React.FC<{ x: number; y0: number; y1: number; marks: string[]; opacity?: number }> = ({ x, y0, y1, marks, opacity = 1 }) => (
  <g opacity={opacity}>
    <rect x={x - 30} y={y1} width={60} height={y0 - y1} rx={10} fill="#fff6d6" stroke={OUT} strokeWidth={SW} />
    {marks.map((m, i) => {
      const yy = y0 - ((y0 - y1) * (i + 1)) / (marks.length + 1);
      return (
        <g key={i}>
          <path d={`M ${x - 30} ${yy} L ${x + 4} ${yy}`} stroke={OUT} strokeWidth={5} />
          <SvgText x={x + 44} y={yy + 16} size={44} anchor="start">
            {m}
          </SvgText>
        </g>
      );
    })}
  </g>
);

export const Shelf: React.FC<P & { items: React.ReactNode }> = ({ x, y, s = 1, items, opacity = 1 }) => (
  <g transform={tr(x, y, s)} opacity={opacity}>
    <rect x={-300} y={-10} width={600} height={30} rx={6} fill={C.trunk} stroke={OUT} strokeWidth={SW} />
    {items}
  </g>
);
