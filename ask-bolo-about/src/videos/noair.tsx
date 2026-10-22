import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Bubbles } from "../art/nature";
import { Cross, MolBubble, SvgText } from "../art/objects";
import { ColdSide, DaySky, Hills, HotSide, Sky, SpaceBg, Split, Stars, Sun } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Hook: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <SpaceBg t={t} />
    <circle cx={540} cy={860} r={tween(t, 0.6, dur, 290, 230)} fill="#7fc0ff" opacity={tween(t, 0.6, dur, 0.4, 0)} />
    <Earth x={540} y={860} r={230} spin={t * 0.15} />
    <Hills y={1500} />
    <Bolo t={t} x={540} y={1770} s={1.1} expression="shocked" pose="cheeks" look={[0, -0.6]} />
  </>
);

const Breathe: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Hills />
    <MolBubble x={540} y={780} s={1.4 * pop(t, 0.2)} label="O2" />
    <Cross x={540} y={780} s={pop(t, 1.0)} />
    <Bolo t={t} x={540} y={1740} s={1.15} expression="worried" />
  </>
);

const SkyScene: React.FC<SceneProps> = ({ t, dur }) => {
  const k = linear(t, 0.3, dur * 0.6, 0, 1);
  return (
    <>
      <DaySky />
      <Sky top="#000000" bottom="#141420" />
      <g opacity={1 - k}>
        <DaySky />
      </g>
      <Stars t={t} n={80} opacity={k} />
      <Sun x={800} y={520} r={90} t={t} />
      <Hills color="#7a7a7a" back="#8a8a8a" line="#24170f" />
      <Bolo t={t} x={460} y={1740} s={1.15} expression="amazed" look={[0.3, -1]} />
    </>
  );
};

const Temps: React.FC<SceneProps> = ({ t }) => (
  <>
    <Split left={<HotSide t={t} />} right={<ColdSide t={t} />} />
    <SvgText x={270} y={560} size={70} color={C.yellow}>
      DAY
    </SvgText>
    <SvgText x={810} y={560} size={70} color="#d6ecff">
      NIGHT
    </SvgText>
    <Bolo t={t} x={270} y={1760} s={0.95} expression="hot" />
    <Bolo t={t} x={810} y={1760} s={0.95} expression="cold" pose="hold" shiver />
  </>
);

const Boil: React.FC<SceneProps> = ({ t, dur }) => {
  const w = tween(t, 0.4, dur, 1100, 1450);
  return (
    <>
      <Sky top="#000000" bottom="#202030" y1={1300} />
      <Stars t={t} n={70} />
      <path d="M -20 1100 C 300 1380, 780 1380, 1100 1100 L 1100 1920 L -20 1920 Z" fill="#8a7a6a" stroke={C.ink} strokeWidth={6} />
      <rect x={0} y={w} width={1080} height={1920} fill={C.water} opacity={0.92} />
      <Bubbles t={t * 3} x={540} y={1650} h={500} n={16} spread={900} />
      {Array.from({ length: 5 }, (_, i) => {
        const p = (t * 0.4 + i / 5) % 1;
        return <circle key={i} cx={160 + i * 190} cy={w - p * 500} r={40 + p * 40} fill="#e8f2ff" opacity={0.5 * (1 - p)} />;
      })}
    </>
  );
};

const Silence: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#000000" bottom="#202030" y1={1300} />
    <Stars t={t} n={70} />
    <Hills color="#7a7a7a" back="#8a8a8a" line="#24170f" />
    <g transform={`translate(540 760) scale(${pop(t, 0.3)})`}>
      <path d="M -120 -60 L -60 -60 L 20 -130 L 20 130 L -60 60 L -120 60 Z" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    </g>
    <Cross x={600} y={760} s={0.9 * pop(t, 0.9)} />
    <Bolo t={t} x={540} y={1740} s={1.1} expression="shocked" />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Sun x={800} y={560} r={100} t={t} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, breathe: Breathe, sky: SkyScene, temps: Temps, boil: Boil, silence: Silence, outro: Outro };
