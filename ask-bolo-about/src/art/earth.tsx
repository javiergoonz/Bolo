import React from "react";
import { tr } from "../engine/anim";
import { C } from "../engine/theme";
import { useUid } from "./sky";

const OUT = C.ink;

const LANDS = [
  "M -60 -80 C -20 -95, 10 -70, -5 -40 C -20 -15, 10 0, 0 30 C -10 60, -30 85, -40 70 C -50 40, -70 20, -75 -10 C -85 -40, -80 -70, -60 -80 Z",
  "M 30 -70 C 60 -85, 95 -60, 85 -30 C 80 0, 70 30, 50 50 C 35 30, 30 0, 20 -20 C 10 -40, 15 -60, 30 -70 Z",
  "M 50 62 C 68 52, 92 64, 82 82 C 72 94, 48 88, 50 62 Z",
  "M -100 20 C -90 10, -78 18, -84 32 C -92 40, -104 32, -100 20 Z",
];

const CLOUDS = [
  [-40, -55, 30, 7],
  [40, 15, 36, 7],
  [-20, 55, 26, 6],
  [70, -45, 22, 6],
];

export type EarthVariant = "normal" | "dry" | "frozen" | "hot";

type Props = {
  x: number;
  y: number;
  r?: number;
  spin?: number; // turns; continents scroll as it grows
  tilt?: number; // degrees, for the axis line
  axis?: boolean;
  variant?: EarthVariant;
  poles?: number; // 0..1 morph to "oceans at the poles, land belt at the equator"
  night?: number; // 0..1 darkness of the right half
  rings?: number; // 0..1 ring opacity
  ringShadow?: number;
  opacity?: number;
  scale?: number;
};

const PALETTE: Record<EarthVariant, { sea: string; land: string; cloud: number; cap: string }> = {
  normal: { sea: "#2f8de4", land: "#3c9a3f", cloud: 0.85, cap: "#ffffff" },
  dry: { sea: "#c98b4b", land: "#9a6a3a", cloud: 0, cap: "#e8c79a" },
  frozen: { sea: "#d4ecff", land: "#f6fbff", cloud: 0.5, cap: "#ffffff" },
  hot: { sea: "#3b86c9", land: "#a58c3a", cloud: 0.4, cap: "#ffffff" },
};

const Rings: React.FC<{ r: number; half: "back" | "front"; opacity: number }> = ({ r, half, opacity }) => {
  const id = useUid();
  const bands = [
    [2.05, 0.1, "#e9d6ab"],
    [1.82, 0.12, "#cdb487"],
    [1.6, 0.1, "#f2e4c2"],
    [1.42, 0.06, "#bda57a"],
  ] as const;
  return (
    <g opacity={opacity} transform="rotate(-14)">
      <defs>
        <clipPath id={id}>
          {half === "back" ? <rect x={-3 * r} y={-3 * r} width={6 * r} height={3 * r} /> : <rect x={-3 * r} y={0} width={6 * r} height={3 * r} />}
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {bands.map(([k, w, col], i) => (
          <g key={i}>
            <ellipse rx={k * r} ry={k * r * 0.24} fill="none" stroke={OUT} strokeWidth={w * r + 8} />
            <ellipse rx={k * r} ry={k * r * 0.24} fill="none" stroke={col} strokeWidth={w * r} />
          </g>
        ))}
      </g>
    </g>
  );
};

export const Earth: React.FC<Props> = ({
  x,
  y,
  r = 200,
  spin = 0,
  tilt = 0,
  axis = false,
  variant = "normal",
  poles = 0,
  night = 0,
  rings = 0,
  ringShadow = 0,
  opacity = 1,
  scale = 1,
}) => {
  const id = useUid();
  const p = PALETTE[variant];
  const k = r / 100;
  const period = 260; // continent band width in unit coords
  const off = (((spin * period) % period) + period) % period;
  return (
    <g transform={tr(x, y, scale)} opacity={opacity}>
      <defs>
        <clipPath id={`${id}c`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r * 1.13} fill="#4a6bd8" opacity={0.3} />
      {rings > 0 ? <Rings r={r} half="back" opacity={rings} /> : null}
      <g clipPath={`url(#${id}c)`}>
        <circle r={r} fill={p.sea} />
        <g transform={`scale(${k})`} opacity={1 - poles}>
          {[-period, 0, period].map((dx) => (
            <g key={dx} transform={`translate(${dx + off - period / 2 + 20} 0)`}>
              {LANDS.map((d, i) => (
                <path key={i} d={d} fill={p.land} stroke={OUT} strokeWidth={4 / k + 1} strokeLinejoin="round" />
              ))}
            </g>
          ))}
          <ellipse cy={-100} rx={80} ry={22} fill={p.cap} />
          <ellipse cy={100} rx={80} ry={20} fill={p.cap} />
        </g>
        {poles > 0 ? (
          <g transform={`scale(${k})`} opacity={poles}>
            <rect x={-110} y={-110} width={220} height={220} fill={p.sea} />
            <path
              d={`M -110 ${-40 + 10 * (1 - poles)} C -60 -60, -10 -30, 40 -50 C 70 -60, 100 -40, 110 -45 L 110 45 C 70 55, 30 35, -10 50 C -50 62, -90 40, -110 48 Z`}
              fill="#5aa64a"
              stroke={OUT}
              strokeWidth={4 / k + 1}
            />
            <path d="M -60 -10 C -30 -25, 10 -5, 30 -15 C 45 -5, 20 15, -10 12 C -40 18, -70 8, -60 -10 Z" fill="#a8864a" opacity={0.8} />
          </g>
        ) : null}
        <g transform={`scale(${k})`} opacity={p.cloud * (1 - poles * 0.5)}>
          {CLOUDS.map(([cx, cy, rx, ry], i) => {
            const cxs = ((((cx + off * 1.3 + 110) % 220) + 220) % 220) - 110;
            return <ellipse key={i} cx={cxs} cy={cy} rx={rx} ry={ry} fill="#fff" opacity={0.85} />;
          })}
        </g>
        {ringShadow > 0 ? <rect x={-r} y={r * 0.12} width={2 * r} height={r * 0.32} fill="#0a0c30" opacity={0.6 * ringShadow} transform="rotate(-14)" /> : null}
        {night > 0 ? <rect x={0} y={-r} width={r} height={2 * r} fill="#08103a" opacity={0.6 * night} /> : null}
        <circle cx={r * 0.42} cy={r * 0.42} r={r * 1.05} fill="none" stroke="#0a1a4a" strokeWidth={r * 0.35} opacity={0.18} />
      </g>
      <circle r={r} fill="none" stroke={OUT} strokeWidth={7} />
      {rings > 0 ? <Rings r={r} half="front" opacity={rings} /> : null}
      {axis ? (
        <g transform={`rotate(${tilt})`}>
          <path d={`M 0 ${-r * 1.32} L 0 ${-r * 0.98} M 0 ${r * 0.98} L 0 ${r * 1.32}`} stroke={OUT} strokeWidth={13} strokeLinecap="round" />
          <path d={`M 0 ${-r * 1.32} L 0 ${-r * 0.98} M 0 ${r * 0.98} L 0 ${r * 1.32}`} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};
