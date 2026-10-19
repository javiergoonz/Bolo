import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Ball, Board, Car, Pencil } from "../art/objects";
import { Cloud, DaySky, Hills, Sky } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { SpeedLines } from "./common";

/** Glossy ground with moving shine streaks: the "no friction" floor. */
const Slick: React.FC<{ y: number; t: number; color?: string; shine?: number }> = ({ y, t, color = "#bfe3f5", shine = 1 }) => (
  <>
    <rect x={-10} y={y} width={1100} height={1930 - y} fill={color} />
    <path d={`M -10 ${y} L 1090 ${y}`} stroke={C.ink} strokeWidth={6} />
    <g stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8 * shine}>
      {[0, 1, 2, 3].map((i) => {
        const x = ((t * 160 + i * 300) % 1300) - 150;
        return <path key={i} d={`M ${x} ${y + 60 + (i % 2) * 120} L ${x + 120} ${y + 40 + (i % 2) * 120}`} />;
      })}
    </g>
  </>
);

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const s0 = at("disappeared");
  const slide = linear(t, s0, s0 + 1.5, 0, 1);
  return (
    <>
      <DaySky />
      <Cloud x={250} y={700} s={1.1} />
      <Hills />
      <g opacity={slide > 0 ? 1 : 0}>
        <ellipse cx={540} cy={1750} rx={260} ry={40} fill="#fff" opacity={0.35} />
      </g>
      <Bolo t={t} x={540 + slide * 140} y={1740} s={1.2} expression="shocked" pose="cheeks" tilt={Math.sin(t * 9) * 8 * slide} />
    </>
  );
};

const Walk: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#9fd6f2" bottom="#e2f4fc" y1={1300} />
    <Cloud x={820} y={560} s={1.0} />
    <Slick y={1500} t={t} color="#b9c4d6" />
    <SpeedLines x={420} y={1620} t={t} opacity={0.9} />
    <Bolo t={t} x={540 + Math.sin(t * 10) * 14} y={1760} s={1.2} expression="worried" pose="run" tilt={Math.sin(t * 6) * 6} />
  </>
);

const Hold: React.FC<SceneProps> = ({ t, at }) => {
  const slip = at("slip") - 0.1;
  const p = linear(t, slip, slip + 1.2, 0, 1);
  const bx = 380;
  const by = 1760;
  const s = 1.15;
  const hx = bx + 205 * s;
  const hy = by - 250 * s;
  return (
    <>
      <Sky top="#ffe6c4" bottom="#ffd09a" />
      <rect x={0} y={1500} width={1080} height={420} fill="#d9a46a" />
      <path d="M 0 1500 L 1080 1500" stroke={C.ink} strokeWidth={6} />
      <Bolo t={t} x={bx} y={by} s={s} expression={p > 0 ? "shocked" : "smile"} pose="reach" look={[1, -0.2]} />
      {p > 0 ? <Pencil x={hx + p * 700} y={hy - Math.sin(p * Math.PI) * 300} s={0.9} r={-30 + p * 400} /> : <Pencil x={hx} y={hy} s={0.9} r={-30} />}
    </>
  );
};

const Screws: React.FC<SceneProps> = ({ t, at, dur }) => {
  const out = tween(t, at("screws") - 0.2, at("walls") + 0.2, 0, 1);
  const fall = linear(t, at("walls") + 0.3, dur, 0, 1);
  const untie = tween(t, at("Knots") - 0.1, at("untie") + 0.4, 0, 1);
  const loop = 70 * (1 - untie);
  return (
    <>
      <Sky top="#efd7b2" bottom="#dcbf94" />
      <g stroke="#c9a676" strokeWidth={5} opacity={0.6}>
        {Array.from({ length: 16 }, (_, r) => (
          <path key={r} d={`M 0 ${r * 120} L 1080 ${r * 120}`} />
        ))}
      </g>
      <g transform={`translate(860 340)`}>
        <path d={`M 0 0 L 0 ${200 - loop}`} stroke="#b07a3e" strokeWidth={16} strokeLinecap="round" />
        {loop > 2 ? <circle cx={0} cy={260 - loop} r={loop * 0.8} fill="none" stroke="#b07a3e" strokeWidth={16} /> : null}
        <path d={`M 0 ${260} Q ${-40 * (1 - untie)} ${330} ${-20 + untie * 20} ${420 + untie * 120}`} fill="none" stroke="#b07a3e" strokeWidth={16} strokeLinecap="round" />
      </g>
      <g transform={`translate(0 ${fall * fall * 900}) rotate(${fall * 25} 540 980)`}>
        <Board x={540} y={980} s={1.3} out={out} />
        <rect x={300} y={830} width={60} height={110} rx={6} fill="#4f9aff" stroke={C.ink} strokeWidth={5} />
        <rect x={365} y={850} width={50} height={90} rx={6} fill="#ff6a3d" stroke={C.ink} strokeWidth={5} />
        <rect x={640} y={860} width={140} height={80} rx={10} fill="#5aa64a" stroke={C.ink} strokeWidth={5} />
      </g>
      <Bolo t={t} x={300} y={1780} s={0.95} expression="shocked" look={[0.6, -0.8]} />
    </>
  );
};

const Cars: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#8fd3ff" bottom="#d6f0ff" y1={1300} />
    <Cloud x={280} y={520} s={1.0} />
    <Hills y={1150} />
    <rect x={0} y={1300} width={1080} height={330} fill="#555a66" />
    <path d="M 0 1300 L 1080 1300 M 0 1630 L 1080 1630" stroke={C.ink} strokeWidth={6} />
    <g stroke="#ffe14a" strokeWidth={12}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M ${40 + i * 240} 1465 L ${160 + i * 240} 1465`} />
      ))}
    </g>
    <Car x={540 + Math.sin(t * 30) * 3} y={1440} s={1.6} wheel={t * 1400} />
    <g fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.85}>
      {[396, 700].map((wx) => (
        <path key={wx} d={`M ${wx - 70} 1350 A 80 80 0 0 1 ${wx + 70} 1350`} transform={`rotate(${(t * 500) % 360} ${wx} 1376)`} />
      ))}
    </g>
  </>
);

const Forever: React.FC<SceneProps> = ({ t }) => {
  const x = ((t * 330) % 1500) - 220;
  return (
    <>
      <Sky top="#9fd6f2" bottom="#e2f4fc" y1={1300} />
      <Cloud x={760} y={600} s={1.1} />
      <Slick y={1500} t={t} />
      <SpeedLines x={x - 120} y={1560} t={t} />
      <Bolo t={t} x={x} y={1760} s={1.1} expression="amazed" pose="armsUp" tilt={-6} />
      <Ball x={((t * 420 + 700) % 1500) - 220} y={1440} s={0.9} r={0} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Cloud x={250} y={700} s={1.1} opacity={pop(t, 0.1)} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  walk: Walk,
  hold: Hold,
  screws: Screws,
  cars: Cars,
  forever: Forever,
  outro: Outro,
};
