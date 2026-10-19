import React from "react";
import { rand, tr } from "../engine/anim";
import { C, H, W } from "../engine/theme";

const OUT = C.ink;

/** Grey moon-like ground so Bolo has somewhere to stand in space scenes. */
export const MoonGround: React.FC<{ y?: number }> = ({ y = 1500 }) => (
  <>
    <path d={`M -40 ${y + 60} Q 540 ${y - 90} 1120 ${y + 60} L 1120 ${H} L -40 ${H} Z`} fill="#b9b9cc" />
    <path d={`M -40 ${y + 60} Q 540 ${y - 90} 1120 ${y + 60}`} fill="none" stroke={OUT} strokeWidth={6} />
    {[
      [180, y + 160, 50],
      [760, y + 120, 36],
      [900, y + 300, 60],
      [330, y + 360, 30],
    ].map(([x, yy, r], i) => (
      <ellipse key={i} cx={x} cy={yy} rx={r} ry={r * 0.35} fill="#9d9db3" stroke={OUT} strokeWidth={4} />
    ))}
  </>
);

/** Cartoon "poof" burst for things disappearing. p goes 0..1. */
export const Poof: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <g transform={tr(x, y, s)} opacity={1 - p}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const d = 40 + p * 120;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={34 * (1 - p * 0.6)} fill="#fff" stroke={OUT} strokeWidth={5} />;
      })}
    </g>
  );
};

/** Wavy heat lines rising. */
export const HeatWaves: React.FC<{ t: number; y: number; opacity?: number }> = ({ t, y, opacity = 1 }) => (
  <g opacity={opacity} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round">
    {Array.from({ length: 6 }, (_, i) => {
      const x = 120 + i * 170;
      const p = (t * 0.5 + rand(i) ) % 1;
      const yy = y - p * 300;
      return <path key={i} opacity={0.6 * (1 - p)} d={`M ${x} ${yy} q 15 -20 0 -40 q -15 -20 0 -40 q 15 -20 0 -40`} />;
    })}
  </g>
);

/** Speed/motion lines trailing to the left of a point. */
export const SpeedLines: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; opacity?: number }> = ({ x, y, t, dir = 1, opacity = 1 }) => (
  <g opacity={opacity} stroke="#fff" strokeWidth={8} strokeLinecap="round">
    {[-60, 0, 60].map((dy, i) => {
      const len = 90 + Math.sin(t * 20 + i) * 30;
      return <path key={i} d={`M ${x - dir * 40} ${y + dy} L ${x - dir * (40 + len)} ${y + dy}`} />;
    })}
  </g>
);

/** Dashed horizontal guide line with a caption. */
export const Guide: React.FC<{ y: number; x0?: number; x1?: number; color?: string; opacity?: number }> = ({
  y,
  x0 = 120,
  x1 = W - 120,
  color = "#fff",
  opacity = 1,
}) => <path d={`M ${x0} ${y} L ${x1} ${y}`} stroke={color} strokeWidth={6} strokeDasharray="22 16" opacity={opacity} />;
