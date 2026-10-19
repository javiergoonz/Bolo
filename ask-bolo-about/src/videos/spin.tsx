import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Arrow, Cross, Hurricane, SvgText } from "../art/objects";
import { ColdSide, HotSide, Sky, SpaceBg, Split, Sun } from "../art/sky";
import { Rain } from "../art/nature";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { MoonGround } from "./common";

// Spin angle with a rotation speed that eases down to zero by `stop` seconds.
const slowing = (t: number, speed: number, stop: number) => {
  const tt = Math.min(t, stop);
  return speed * (tt - (tt * tt) / (2 * stop));
};

const Hook: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={820} r={230} spin={slowing(t, 0.9, dur)} axis tilt={0} scale={pop(t, 0.05)} />
    <MoonGround />
    <Bolo t={t} x={540} y={1760} s={1.15} expression="shocked" pose="cheeks" look={[0, -0.6]} />
  </>
);

const LongDay: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <SpaceBg t={t} />
    <Sun x={60} y={860} r={150} t={t} />
    <Earth x={650} y={860} r={230} spin={0.1 + t * 0.01} night={1} />
    <g transform={`translate(520 560) scale(${pop(t, at("sunshine") - 0.1)})`}>
      <SvgText x={0} y={0} size={66} color={C.yellow}>
        6 MONTHS DAY
      </SvgText>
    </g>
    <g transform={`translate(760 1190) scale(${pop(t, at("darkness") - 0.1)})`}>
      <SvgText x={0} y={0} size={66} color="#9fb6ff">
        6 MONTHS NIGHT
      </SvgText>
    </g>
  </>
);

const HotCold: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Split left={<HotSide t={t} />} right={<ColdSide t={t} />} />
    <g transform={`translate(270 560) scale(${pop(t, at("bake") - 0.1)})`}>
      <SvgText x={0} y={0} size={70} color={C.yellow}>
        DAY SIDE
      </SvgText>
    </g>
    <g transform={`translate(810 560) scale(${pop(t, at("night") - 0.1)})`}>
      <SvgText x={0} y={0} size={70} color="#d6ecff">
        NIGHT SIDE
      </SvgText>
    </g>
    <Bolo t={t} x={270} y={1760} s={0.95} expression="hot" />
    <Bolo t={t} x={810} y={1760} s={0.95} expression="cold" pose="hold" shiver />
  </>
);

const Oceans: React.FC<SceneProps> = ({ t, at }) => {
  const m = tween(t, at("slide") - 0.4, at("poles") + 0.6, 0, 1);
  const ar = linear(t, at("water") - 0.2, at("water") + 0.2, 0, 1);
  return (
    <>
      <SpaceBg t={t} />
      <Earth x={540} y={830} r={290} poles={m} />
      <Arrow x1={540} y1={760} x2={540} y2={590} color="#7fd0ff" opacity={ar} />
      <Arrow x1={540} y1={900} x2={540} y2={1070} color="#7fd0ff" opacity={ar} />
    </>
  );
};

const Continent: React.FC<SceneProps> = ({ t }) => {
  const k = pop(t, 0.3, 0.5);
  return (
    <>
      <SpaceBg t={t} />
      <Earth x={540} y={830} r={290} poles={1} />
      <ellipse cx={540} cy={830} rx={330 * k} ry={110 * k} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray="30 20" transform="rotate(-2 540 830)" />
      <Bolo t={t} x={880} y={1780} s={0.85} expression="amazed" pose="point" look={[-0.5, -0.8]} />
    </>
  );
};

const Storms: React.FC<SceneProps> = ({ t, at }) => {
  const stop = at("form");
  const rot = slowing(t, 300, stop);
  return (
    <>
      <Sky top="#4a5a7a" bottom="#9fb2c9" y1={1400} />
      <Rain t={t} y0={300} y1={1250} n={18} opacity={tween(t, stop, stop + 0.6, 1, 0)} />
      <Hurricane x={540} y={760} s={1.6} r={rot} opacity={tween(t, stop + 0.2, stop + 0.9, 1, 0.45)} />
      <Cross x={540} y={760} s={1.6 * pop(t, at("couldn't"))} />
      <path d="M -20 1300 C 300 1250, 700 1340, 1100 1270 L 1100 1920 L -20 1920 Z" fill="#2c6a35" stroke={C.ink} strokeWidth={6} />
      <Bolo t={t} x={540} y={1760} s={1.1} expression="worried" look={[0, -0.8]} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={830} r={230} spin={t * 0.35} axis />
    <MoonGround />
    <Bolo t={t} x={540} y={1760} s={1.15} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  longday: LongDay,
  hotcold: HotCold,
  oceans: Oceans,
  continent: Continent,
  storms: Storms,
  outro: Outro,
};
