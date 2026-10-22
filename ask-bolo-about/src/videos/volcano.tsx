import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Volcano } from "../art/extra";
import { Snow, Tree } from "../art/nature";
import { Cross, Thermometer } from "../art/objects";
import { DaySky, Hills, Sky, Sun } from "../art/sky";
import { Plane } from "../art/extra";
import { linear, pop, rand, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Ash: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g opacity={k}>
    {Array.from({ length: 12 }, (_, i) => (
      <circle key={i} cx={rand(i) * 1080 + Math.sin(t * 0.5 + i) * 40} cy={200 + rand(i + 5) * 700} r={120 + rand(i + 9) * 120} fill="#5a5258" opacity={0.55} />
    ))}
  </g>
);

const Hook: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <DaySky />
    {[200, 540, 880].map((x, i) => (
      <Volcano key={x} x={x} y={1280} s={0.6 + (i % 2) * 0.15} t={t} erupt={linear(t, 0.8 + i * 0.3, dur, 0, 1)} />
    ))}
    <Hills y={1300} />
    <Bolo t={t} x={540} y={1740} s={1.15} expression="shocked" pose="cheeks" />
  </>
);

const AshScene: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#7a6e70" bottom="#c9b8a8" y1={1300} />
    <Volcano x={540} y={1350} s={1.0} t={t} erupt={1} />
    <Ash t={t} k={tween(t, 0, 1.5, 0.3, 1)} />
    <Plane x={760} y={560} s={1.1} r={-6} />
    <Cross x={760} y={540} s={pop(t, at("planes"))} />
    <Hills y={1360} color="#4f6b34" back="#5a7a3c" />
  </>
);

const Gray: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <DaySky />
    <Sun x={780} y={520} r={110} t={t} />
    <rect width={1080} height={1920} fill="#4a4248" opacity={linear(t, 0.2, dur * 0.7, 0, 0.75)} />
    <Ash t={t} k={linear(t, 0.2, dur * 0.7, 0, 1)} />
    <Hills color="#3f5a34" back="#4a6a3c" />
    <Bolo t={t} x={540} y={1740} s={1.15} expression="worried" look={[0.4, -0.8]} />
  </>
);

const Winter: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#6b7280" bottom="#b8c0cc" y1={1300} />
    <Snow t={t} n={40} />
    <Hills color="#e6eef6" back="#d6e0ea" line="#24170f" />
    <Tree x={200} y={1330} s={0.8} t={t} color="#7a9a7a" />
    <Thermometer x={860} y={1100} s={0.95} hot={false} level={tween(t, 0.3, 3, 0.55, 0.12)} />
    <Bolo t={t} x={480} y={1760} s={1.1} expression="cold" pose="hold" shiver />
  </>
);

const Land: React.FC<SceneProps> = ({ t, dur }) => {
  const g = tween(t, 0.3, dur - 0.5, 0, 1);
  return (
    <>
      <DaySky />
      <rect x={0} y={1200} width={1080} height={720} fill={C.water} />
      <path d="M 0 1200 L 1080 1200" stroke={C.ink} strokeWidth={6} />
      <g transform={`translate(0 ${(1 - g) * 300})`}>
        <Volcano x={540} y={1300} s={0.9} t={t} erupt={0.6} />
        <path d="M 180 1300 Q 540 1150 900 1300 Z" fill="#3a2f2a" stroke={C.ink} strokeWidth={6} />
        <Tree x={300} y={1260} s={0.6 * pop(t, dur - 1.6)} t={t} />
        <Tree x={780} y={1260} s={0.5 * pop(t, dur - 1.3)} t={t} />
      </g>
      <rect x={0} y={1300} width={1080} height={620} fill={C.water} opacity={0.9} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Volcano x={800} y={1290} s={0.75} t={t} />
    <Hills />
    <Bolo t={t} x={460} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, ash: AshScene, gray: Gray, winter: Winter, land: Land, outro: Outro };
