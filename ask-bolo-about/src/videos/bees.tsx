import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Bee, Bird, Bunny, Squirrel } from "../art/animals";
import { Flower, Wheat } from "../art/nature";
import { Almond, Apple, Blueberry, Check, Cross, DotPath, HoneyJar, Paintbrush, PriceTag, QuestionMark, Shelf } from "../art/objects";
import { DaySky, Hills, Sky, Sun } from "../art/sky";
import { bob, linear, pop, rand, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Poof } from "./common";

const FLOWERS: [number, number, string][] = [
  [130, 1420, "#ff6f91"],
  [320, 1380, "#ffb02e"],
  [770, 1380, "#b06fff"],
  [950, 1420, "#ff6f91"],
];

const Meadow: React.FC<{ t: number; droop?: number }> = ({ t, droop = 0 }) => (
  <>
    <DaySky />
    <Hills />
    {FLOWERS.map(([x, y, c], i) => (
      <Flower key={i} x={x} y={y} s={1.05} color={c} t={t} droop={droop} />
    ))}
  </>
);

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const gone = at("disappeared") + 0.2;
  return (
    <>
      <Meadow t={t} />
      {[0, 1, 2].map((i) => {
        const x = 540 + Math.cos(t * 1.6 + i * 2.1) * 330;
        const y = 820 + Math.sin(t * 2.2 + i * 2.1) * 140 + i * 60;
        return (
          <g key={i}>
            <Bee x={x} y={y} s={0.95 * tween(t, gone, gone + 0.25, 1, 0)} t={t} flip={Math.sin(t * 1.6 + i * 2.1) < 0} />
            <Poof x={x} y={y} p={linear(t, gone, gone + 0.5, 0, 1)} s={0.6} />
          </g>
        );
      })}
      <Bolo t={t} x={540} y={1730} s={1.2} expression="shocked" pose="cheeks" />
    </>
  );
};

const Pollen: React.FC<SceneProps> = ({ t, dur, at }) => {
  const p = (t / 2.2) % 1;
  const path: [number, number][] = [
    [250, 1010],
    [400, 820],
    [560, 760],
    [700, 820],
    [830, 1010],
  ];
  const seg = p * (path.length - 1);
  const k = Math.min(path.length - 2, Math.floor(seg));
  const f = seg - k;
  const bx = path[k][0] + (path[k + 1][0] - path[k][0]) * f;
  const by = path[k][1] + (path[k + 1][1] - path[k][1]) * f;
  const ghost = at("bees") > 0 ? 1 : 0;
  return (
    <>
      <DaySky />
      <Hills />
      <Flower x={250} y={1400} s={1.9} color="#ff6f91" t={t} droop={linear(t, 0.3, at("seeds") + 0.3, 0, 0.45)} />
      <Flower x={830} y={1400} s={1.9} color="#ffb02e" t={t} droop={linear(t, 0.3, at("seeds") + 0.3, 0, 0.45)} />
      <g opacity={tween(t, at("bees") - 0.2, at("bees") + 0.3, 0, ghost)}>
        <DotPath d={path} progress={p} color={C.yellow} r={9} />
        <Bee x={bx} y={by + bob(t, 10, 1.5)} s={1.1} t={t} flip />
      </g>
      <Cross x={540} y={600} s={0.9 * pop(t, dur - 1.2)} />
    </>
  );
};

const Food: React.FC<SceneProps> = ({ t, at }) => {
  const tag = at("expensive") - 0.1;
  const honey = at("honey");
  return (
    <>
      <Sky top="#fff2cf" bottom="#ffd9a0" />
      <rect x={0} y={1350} width={1080} height={570} fill="#e8b97a" />
      <path d="M 0 1350 L 1080 1350" stroke={C.ink} strokeWidth={6} />
      <Shelf
        x={540}
        y={880}
        items={
          <>
            <Apple x={-200} y={-70} s={1.1 * pop(t, 0.1)} />
            <Almond x={0} y={-66} s={1.1 * pop(t, at("almonds") - 0.1)} r={20} />
            <Blueberry x={200} y={-50} s={1.1 * pop(t, at("blueberries") - 0.1)} />
          </>
        }
      />
      {[-200, 0, 200].map((dx, i) => (
        <PriceTag key={dx} x={540 + dx} y={1000} s={1.0 * pop(t, tag + i * 0.12)} r={-8 + i * 6} text="$$$" />
      ))}
      <HoneyJar x={820} y={1330} s={1.05 * pop(t, honey - 0.3)} />
      <Cross x={820} y={1250} s={0.8 * pop(t, honey + 0.1)} />
      <Bolo t={t} x={300} y={1760} s={1.05} expression="shocked" look={[0.6, -0.4]} />
    </>
  );
};

const Hand: React.FC<SceneProps> = ({ t }) => {
  const brush = Math.sin(t * 6) * 18;
  return (
    <>
      <DaySky />
      <Sun x={900} y={420} r={80} t={t} />
      <Hills />
      <Flower x={790} y={1520} s={2.0} color="#ff6f91" t={t} />
      <Flower x={1010} y={1520} s={1.3} color="#ffb02e" t={t} />
      {Array.from({ length: 6 }, (_, i) => {
        const p = (t * 0.8 + rand(i)) % 1;
        return <circle key={i} cx={730 + rand(i + 3) * 120} cy={1130 - p * 160} r={7} fill={C.yellow} stroke={C.ink} strokeWidth={3} opacity={1 - p} />;
      })}
      <Bolo t={t} x={420} y={1760} s={1.15} expression="tired" pose="reach" item={<Paintbrush x={10} y={0} s={1.2} r={70 + brush} />} />
    </>
  );
};

const Animals: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#9cc8dc" bottom="#d8ecf2" y1={1300} />
    <Hills color="#5d7a3a" back="#6b8a44" />
    <Flower x={540} y={1380} s={1.2} color="#c9a0a8" droop={1} t={t} />
    <Bird x={260} y={760} s={1.5} t={t} />
    <QuestionMark x={260} y={590} t={t} s={pop(t, at("animals"))} />
    <Squirrel x={800} y={1360} s={1.4} t={t} />
    <QuestionMark x={760} y={1010} t={t} s={pop(t, at("seeds"))} />
    <Bunny x={300} y={1720} s={1.3} t={t} />
    <QuestionMark x={420} y={1540} t={t} s={pop(t, at("hungry"))} />
  </>
);

const Grains: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <DaySky />
    <Sun x={860} y={430} r={80} t={t} />
    <Hills color="#c9a23a" back="#d8b44c" line="#6b5418" />
    <g fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8}>
      {[0, 1, 2].map((i) => {
        const x = ((t * 420 + i * 380) % 1400) - 200;
        return <path key={i} d={`M ${x} ${700 + i * 110} q 60 -30 120 0 q 60 30 120 0`} />;
      })}
    </g>
    {Array.from({ length: 9 }, (_, i) => (
      <Wheat key={i} x={60 + i * 120} y={1500 + (i % 2) * 40} s={1.15} t={t} />
    ))}
    <Check x={540} y={1050} s={pop(t, at("wind"))} />
    <Bolo t={t} x={540} y={1790} s={1.0} expression="smile" />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <Meadow t={t} />
    {[0, 1].map((i) => (
      <Bee key={i} x={540 + Math.cos(t * 1.8 + i * 3) * 300} y={760 + Math.sin(t * 2.4 + i * 3) * 110} s={pop(t, 0.2 + i * 0.3)} t={t} flip={Math.sin(t * 1.8 + i * 3) < 0} />
    ))}
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  pollen: Pollen,
  food: Food,
  hand: Hand,
  animals: Animals,
  grains: Grains,
  outro: Outro,
};
