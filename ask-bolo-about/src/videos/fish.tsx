import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Bird, Fish } from "../art/animals";
import { Algae, Dolphin, Plate, Seal } from "../art/extra";
import { Bubbles, Coral, Seaweed } from "../art/nature";
import { QuestionMark } from "../art/objects";
import { DaySky, Underwater } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Poof } from "./common";

const SCHOOL: [number, number, string][] = [
  [260, 700, "#ff8a2e"],
  [760, 820, "#ffd23f"],
  [420, 1000, "#ff6f91"],
  [820, 1150, "#7fd0ff"],
  [220, 1250, "#ffd23f"],
];

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const gone = at("disappeared") + 0.2;
  return (
    <>
      <Underwater t={t} />
      {SCHOOL.map(([x, y, c], i) => (
        <g key={i}>
          <Fish x={x + Math.sin(t + i) * 40} y={y} s={1.3 * tween(t, gone, gone + 0.25, 1, 0)} t={t} color={c} flip={i % 2 === 0} />
          <Poof x={x} y={y} p={linear(t, gone, gone + 0.5, 0, 1)} s={0.5} />
        </g>
      ))}
      <Bolo t={t} x={540} y={1740} s={1.1} expression="shocked" pose="cheeks" />
    </>
  );
};

const Animals: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <rect x={0} y={900} width={1080} height={1020} fill={C.water} />
    <path d="M 0 900 L 1080 900" stroke={C.ink} strokeWidth={6} />
    <Bird x={300} y={560} s={1.2} t={t} color="#f2f4f8" />
    <QuestionMark x={300} y={420} t={t} s={pop(t, 0.6)} />
    <Seal x={760} y={1000} s={1.0} />
    <Dolphin x={460} y={1350} s={1.1} r={Math.sin(t * 2) * 6} />
    <QuestionMark x={760} y={800} t={t} s={pop(t, 1.4)} />
  </>
);

const People: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <DaySky />
    <rect x={0} y={1400} width={1080} height={520} fill="#e8b97a" />
    <path d="M 0 1400 L 1080 1400" stroke={C.ink} strokeWidth={6} />
    <Plate x={540} y={980} s={1.4 * pop(t, 0.2)} empty={t > dur * 0.6} />
    <Bolo t={t} x={540} y={1760} s={1.1} expression={t > dur * 0.6 ? "sad" : "smile"} />
  </>
);

const AlgaeScene: React.FC<SceneProps> = ({ t, dur }) => {
  const g = tween(t, 0.2, dur, 0.4, 2.2);
  return (
    <>
      <Underwater t={t} top="#2f7a5a" bottom="#0c3a2a" />
      {[120, 330, 540, 750, 960].map((x) => (
        <Algae key={x} x={x} y={1600} s={1} t={t} grow={g} />
      ))}
      <rect width={1080} height={1920} fill="#4f9a2e" opacity={linear(t, 0.5, dur, 0, 0.3)} />
    </>
  );
};

const CoralScene: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <Underwater t={t} />
    <g opacity={1 - linear(t, 0.5, dur, 0, 0.6)}>
      <Coral x={240} y={1600} s={1.6} />
      <Coral x={800} y={1620} s={1.4} color="#ff9ad5" />
      <Seaweed x={540} y={1610} s={1.4} t={t} />
    </g>
    <Algae x={240} y={1600} s={1} t={t} grow={linear(t, 0.5, dur, 0.3, 1.2)} />
    <Algae x={800} y={1610} s={1} t={t} grow={linear(t, 0.5, dur, 0.3, 1.0)} />
    <Bubbles t={t} x={540} y={1500} h={800} n={8} spread={700} />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <Underwater t={t} />
    {SCHOOL.map(([x, y, c], i) => (
      <Fish key={i} x={x + Math.sin(t + i) * 40} y={y} s={1.3 * pop(t, 0.1 + i * 0.12)} t={t} color={c} flip={i % 2 === 0} />
    ))}
    <Coral x={160} y={1620} s={1.2} />
    <Bolo t={t} x={560} y={1740} s={1.1} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, animals: Animals, people: People, algae: AlgaeScene, coral: CoralScene, outro: Outro };
