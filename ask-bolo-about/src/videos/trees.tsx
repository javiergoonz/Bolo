import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Owl, Squirrel } from "../art/animals";
import { Bubbles, Plankton, Rain, Stump, Tree } from "../art/nature";
import { City, MolBubble, QuestionMark, Thermometer } from "../art/objects";
import { DaySky, Hills, Sky, Sun, Underwater } from "../art/sky";
import { linear, pop, rand, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { HeatWaves, Poof } from "./common";

const TREES: [number, number, number][] = [
  [170, 1390, 1.0],
  [400, 1310, 0.8],
  [760, 1320, 0.85],
  [960, 1400, 1.05],
];

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const gone = at("disappeared") + 0.15;
  return (
    <>
      <DaySky />
      <Hills />
      {TREES.map(([x, y, s], i) => (
        <g key={i}>
          <Stump x={x} y={y} s={s * linear(t, gone, gone + 0.1, 0, 1)} />
          <Tree x={x} y={y} s={s * tween(t, gone + i * 0.06, gone + 0.3 + i * 0.06, 1, 0)} t={t} />
          <Poof x={x} y={y - 200 * s} p={linear(t, gone + i * 0.06, gone + 0.6 + i * 0.06, 0, 1)} s={0.9} />
        </g>
      ))}
      <Bolo t={t} x={560} y={1740} s={1.2} expression="shocked" pose="cheeks" />
    </>
  );
};

const Air: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Underwater t={t} />
    {Array.from({ length: 16 }, (_, i) => (
      <Plankton key={i} x={80 + rand(i + 4) * 920} y={560 + rand(i + 40) * 900} s={0.8 + rand(i) * 0.7} t={t} />
    ))}
    {[0, 1, 2, 3].map((i) => {
      const p = (t * 0.22 + i * 0.25) % 1;
      return <MolBubble key={i} x={200 + i * 230} y={1450 - p * 1100} s={0.95 * pop(t, at("oxygen") - 0.2 + i * 0.15)} label="O2" opacity={p < 0.85 ? 1 : (1 - p) / 0.15} />;
    })}
    <Bubbles t={t} x={540} y={1500} h={900} n={10} spread={700} />
  </>
);

const Warm: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#ff9a5a" bottom="#ffe0a0" y1={1300} />
    <Sun x={840} y={420} r={90} t={t} />
    <Hills color="#8a8f3a" back="#9aa04a" line="#3e4119" />
    {TREES.map(([x, y, s], i) => (
      <Stump key={i} x={x} y={y} s={s} />
    ))}
    {[0, 1, 2].map((i) => {
      const p = (t * 0.25 + i / 3) % 1;
      return <MolBubble key={i} x={160 + i * 230} y={1200 - p * 800} s={0.9 * pop(t, at("carbon") - 0.2 + i * 0.2)} label="CO2" color="#9aa3b5" opacity={p < 0.8 ? 1 : (1 - p) / 0.2} />;
    })}
    <Thermometer x={880} y={1130} s={1.0} level={tween(t, at("heat") - 0.3, at("faster") + 0.4, 0.35, 0.9)} />
    <Bolo t={t} x={330} y={1760} s={1.05} expression="hot" />
  </>
);

const Soil: React.FC<SceneProps> = ({ t, at }) => {
  const slide = linear(t, at("wash") - 0.3, at("away") + 0.6, 0, 1);
  return (
    <>
      <Sky top="#4f5b73" bottom="#a3adbf" y1={1300} />
      <Rain t={t} y0={250} y1={1500} n={34} />
      <path d="M -20 700 C 300 760, 600 1150, 1100 1350 L 1100 1920 L -20 1920 Z" fill="#8a5a32" stroke={C.ink} strokeWidth={6} />
      <path d="M -20 700 C 300 760, 600 1150, 1100 1350" fill="none" stroke="#5aa64a" strokeWidth={22} opacity={1 - slide} />
      <Stump x={180} y={760} s={0.9} />
      <Stump x={460} y={940} s={0.9} />
      {Array.from({ length: 9 }, (_, i) => {
        const u = Math.min(1, slide * 1.3 + rand(i) * 0.3 - 0.15);
        const x0 = 120 + i * 90;
        const x = x0 + u * 500;
        const y = 740 + (x / 1080) * 560 + Math.sin(i) * 20 - 25;
        return <circle key={i} cx={x} cy={y} r={20 + rand(i + 2) * 14} fill="#6b4426" stroke={C.ink} strokeWidth={4} opacity={u > 0 ? 1 : 0} />;
      })}
      <Bolo t={t} x={300} y={1780} s={1.0} expression="worried" look={[0.7, -0.3]} />
    </>
  );
};

const Homes: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <DaySky />
    <Hills />
    <Stump x={300} y={1390} s={2.0} />
    <Owl x={300} y={1260} s={1.3} t={t} />
    <QuestionMark x={300} y={980} t={t} s={pop(t, at("owls"))} />
    <Stump x={790} y={1400} s={1.5} />
    <Squirrel x={790} y={1330} s={1.25} t={t} />
    <QuestionMark x={760} y={1020} t={t} s={pop(t, at("squirrels"))} />
    <QuestionMark x={540} y={760} t={t} s={pop(t, at("homes"))} />
  </>
);

const Shade: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#ff8a3c" bottom="#ffd27a" y1={1300} />
    <Sun x={540} y={520} r={130} t={t} scale={tween(t, 0, at("hotter") + 0.3, 0.8, 1.15)} />
    <City y={1400} />
    <rect x={0} y={1400} width={1080} height={520} fill="#9a9aa8" />
    <path d="M 0 1400 L 1080 1400" stroke={C.ink} strokeWidth={6} />
    <HeatWaves t={t} y={1380} />
    <Bolo t={t} x={540} y={1780} s={1.05} expression="hot" />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Hills />
    {TREES.map(([x, y, s], i) => (
      <Tree key={i} x={x} y={y} s={s * pop(t, 0.1 + i * 0.15)} t={t} />
    ))}
    <Bolo t={t} x={560} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  air: Air,
  warm: Warm,
  soil: Soil,
  homes: Homes,
  shade: Shade,
  outro: Outro,
};
