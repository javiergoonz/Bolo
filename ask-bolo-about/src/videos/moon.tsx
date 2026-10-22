import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Crab } from "../art/animals";
import { House } from "../art/extra";
import { Arrow } from "../art/objects";
import { Coast, Hills, Moon, NightSky, Sky, SpaceBg, Sun } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Hook: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <NightSky t={t} />
    <Moon x={540} y={700} r={tween(t, 0.4, dur - 0.3, 90, 180)} />
    <Hills />
    <Bolo t={t} x={540} y={1730} s={1.2} expression="shocked" pose="cheeks" look={[0, -0.7]} />
  </>
);

const Tides: React.FC<SceneProps> = ({ t, dur }) => {
  const water = 1150 - Math.max(0, Math.sin((t / dur) * Math.PI * 1.6)) * 330;
  return (
    <>
      <Coast t={t} water={water} />
      <Moon x={860} y={360} r={150} />
      <House x={200} y={1050} s={0.6} />
      <Crab x={330} y={1220} s={0.9} t={t} />
    </>
  );
};

const Size: React.FC<SceneProps> = ({ t, at }) => {
  const k = tween(t, 0.3, 1.6, 1, 2);
  const bright = linear(t, at("brighter") - 0.5, at("brighter"), 0, 1);
  return (
    <>
      <NightSky t={t} />
      <circle cx={540} cy={720} r={420} fill="#fff6c0" opacity={0.18 * bright} />
      <circle cx={540} cy={720} r={110} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="18 14" opacity={0.6} />
      <Moon x={540} y={720} r={110 * k} />
      <Hills color="#2f7f36" back="#358a3c" />
      <Bolo t={t} x={540} y={1740} s={1.15} expression="amazed" look={[0, -1]} />
    </>
  );
};

const Eclipse: React.FC<SceneProps> = ({ t, dur }) => {
  const mx = linear(t, 0.2, dur - 0.5, 140, 940);
  const cover = 1 - Math.min(1, Math.abs(mx - 540) / 260);
  return (
    <>
      <Sky top="#7cb6e8" bottom="#d8eefc" y1={1300} />
      <rect width={1080} height={1920} fill="#0b1035" opacity={0.85 * cover} />
      <Sun x={540} y={700} r={150} t={t} />
      <circle cx={mx} cy={700} r={175} fill="#1a1a24" stroke={C.ink} strokeWidth={6} />
      <Hills />
      <Bolo t={t} x={540} y={1740} s={1.15} expression="amazed" look={[0, -1]} />
    </>
  );
};

const Quakes: React.FC<SceneProps> = ({ t }) => {
  const sh = Math.sin(t * 40) * 8;
  return (
    <>
      <SpaceBg t={t} />
      <Moon x={860} y={520} r={150} />
      <Arrow x1={540} y1={820} x2={720} y2={640} />
      <g transform={`translate(${sh} 0)`}>
        <Earth x={420} y={980} r={260} spin={t * 0.1} />
      </g>
      <g transform={`translate(420 980) scale(${pop(t, 1)})`}>
        <path d="M -60 -40 L -20 -10 L -50 20 L 0 60" fill="none" stroke={C.yellow} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <NightSky t={t} />
    <Moon x={540} y={760} r={110} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, tides: Tides, size: Size, eclipse: Eclipse, quakes: Quakes, outro: Outro };
