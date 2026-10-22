import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Owl } from "../art/animals";
import { Bat, Fireflies, House } from "../art/extra";
import { Cross, QuestionMark } from "../art/objects";
import { DaySky, Hills, Moon, NightSky, Sky, Stars, Sun } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import type { SceneMap, SceneProps } from "../engine/types";
import { HeatWaves } from "./common";

const Hook: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Sun x={800} y={620} r={100} t={t} />
    <Hills />
    <Bolo t={t} x={540} y={1730} s={1.2} expression="shocked" pose="cheeks" />
  </>
);

const Sleep: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Sun x={820} y={460} r={100} t={t} />
    <Hills />
    <House x={260} y={1420} s={0.8} />
    <Bolo t={t} x={620} y={1760} s={1.15} expression="tired" />
    <QuestionMark x={760} y={1200} t={t} s={pop(t, 1.2)} />
  </>
);

const Hot: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <Sky top="#ff8a3c" bottom="#ffd27a" y1={1300} />
    <Sun x={540} y={560} r={tween(t, 0, dur, 110, 140)} t={t} />
    <Hills color="#8a8f3a" back="#9aa04a" line="#3e4119" />
    <HeatWaves t={t} y={1400} />
    <Bolo t={t} x={540} y={1760} s={1.1} expression="hot" />
  </>
);

const Stars_: React.FC<SceneProps> = ({ t, dur }) => {
  const fade = linear(t, 0.2, dur * 0.6, 1, 0);
  return (
    <>
      <NightSky t={t} />
      <g opacity={1 - fade}>
        <DaySky />
      </g>
      <Stars t={t} n={60} opacity={fade} />
      <Moon x={760} y={560} r={90} opacity={fade} />
      <Hills />
      <Bolo t={t} x={540} y={1740} s={1.15} expression="sad" look={[0, -1]} />
    </>
  );
};

const Animals: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <DaySky />
    <Sun x={860} y={420} r={90} t={t} />
    <Hills />
    <Owl x={260} y={1300} s={1.3} t={t} />
    <Bat x={760} y={760} s={1.4} t={t} />
    <Fireflies t={t} opacity={0.5} />
    <Cross x={540} y={1000} s={1.1 * pop(t, dur - 1.4)} />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <NightSky t={t} />
    <Moon x={760} y={600} r={100} />
    <Fireflies t={t} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, sleep: Sleep, hot: Hot, stars: Stars_, animals: Animals, outro: Outro };
