import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Mountain, Tree } from "../art/nature";
import { BathScale, Rock, Rocket, SvgText } from "../art/objects";
import { DaySky, Hills, Sky, SpaceBg, Split } from "../art/sky";
import { linear, pop, rand, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Guide, MoonGround } from "./common";

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const grow = tween(t, at("twice") - 0.2, at("big") + 0.4, 1, 1.9);
  return (
    <>
      <SpaceBg t={t} />
      <circle cx={540} cy={860} r={170} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="20 16" opacity={grow > 1.05 ? 0.7 : 0} />
      <Earth x={540} y={860} r={170} spin={t * 0.2} scale={grow * pop(t, 0.05)} />
      <MoonGround y={1560} />
      <Bolo t={t} x={540} y={1790} s={1.1} expression="shocked" pose="cheeks" look={[0, -0.7]} />
    </>
  );
};

const Gravity: React.FC<SceneProps> = ({ t, at }) => {
  const dbl = at("twice") - 0.1;
  const heavy = t > dbl;
  return (
    <>
      <Sky top="#cfe8f5" bottom="#a8d2e8" />
      <rect x={0} y={1560} width={1080} height={360} fill="#e0c79a" />
      <path d="M 0 1560 L 1080 1560" stroke={C.ink} strokeWidth={6} />
      <BathScale x={540} y={1690} s={1.3} value="" />
      <g transform="translate(540 760)">
        <rect x={-230} y={-110} width={460} height={190} rx={30} fill="#1b2a3a" stroke={C.ink} strokeWidth={8} />
        <SvgText x={0} y={40} size={130} color={heavy ? C.yellow : "#7dffb0"}>
          {heavy ? "60 KG" : "30 KG"}
        </SvgText>
      </g>
      <Bolo t={t} x={540} y={1630} s={1.05} expression={heavy ? "grit" : "smile"} squash={heavy ? tween(t, dbl, dbl + 0.3, 1, 0.86) : 1} />
      <g transform={`translate(840 590) rotate(12) scale(${pop(t, dbl)})`}>
        <SvgText x={0} y={0} size={130} color={C.yellow}>
          X2
        </SvgText>
      </g>
    </>
  );
};

const Jump: React.FC<SceneProps> = ({ t, at }) => {
  const after = t > at("jump") - 0.3;
  const H = after ? 140 : 300;
  const ph = (t % 0.9) / 0.9;
  const lift = Math.sin(ph * Math.PI) * H;
  return (
    <>
      <DaySky />
      <Hills />
      <Guide y={1740 - 300 * 1.1 - 470} opacity={0.9} />
      <SvgText x={190} y={1740 - 300 * 1.1 - 490} size={52} anchor="start">
        NORMAL EARTH
      </SvgText>
      <g opacity={linear(t, at("half") - 0.3, at("half"), 0, 1)}>
        <Guide y={1740 - 150 * 1.1 - 470} color={C.yellow} />
        <SvgText x={190} y={1740 - 150 * 1.1 - 490} size={52} anchor="start" color={C.yellow}>
          BIG EARTH
        </SvgText>
      </g>
      <Bolo t={t} x={540} y={1740} s={1.1} expression={after ? "tired" : "happy"} pose={lift > 20 ? "armsUp" : "idle"} lift={lift} squash={lift < 10 ? 0.9 : 1} />
    </>
  );
};

const Trees: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Split
      left={
        <>
          <DaySky />
          <Hills />
        </>
      }
      right={
        <>
          <Sky top="#9fd0a8" bottom="#d6f0d0" y1={1300} />
          <Hills color="#2b7a2b" back="#358a35" />
        </>
      }
    />
    <g transform="translate(270 1420) scale(0.85 1.55)">
      <Tree x={0} y={0} s={1} t={t} />
    </g>
    <g transform={`translate(810 1420) scale(${1.5 * pop(t, at("shorter") - 0.2)} ${0.75 * pop(t, at("shorter") - 0.2)})`}>
      <Tree x={0} y={0} s={1} t={t} color={C.leafDark} />
    </g>
    <SvgText x={270} y={1560} size={56}>
      NORMAL
    </SvgText>
    <SvgText x={810} y={1560} size={56} color={C.yellow}>
      BIG EARTH
    </SvgText>
  </>
);

const Mountains: React.FC<SceneProps> = ({ t, at }) => {
  const c = at("crumble") - 0.2;
  const h = tween(t, c, c + 0.8, 1000, 520);
  return (
    <>
      <Sky top="#7cb6e8" bottom="#d8eefc" y1={1300} />
      <Mountain x={540} y={1450} w={900} h={h} />
      {Array.from({ length: 10 }, (_, i) => {
        const p = linear(t, c + rand(i) * 0.5, c + 1.0 + rand(i) * 0.5, 0, 1);
        return p > 0 && p < 1 ? <Rock key={i} x={400 + rand(i + 7) * 280 + (rand(i + 2) - 0.5) * p * 600} y={1450 - h * 0.6 + p * 600} s={1.4} r={p * 300} /> : null;
      })}
      <rect x={0} y={1450} width={1080} height={470} fill="#6b8a44" />
      <path d="M 0 1450 L 1080 1450" stroke={C.ink} strokeWidth={6} />
      <Bolo t={t} x={860} y={1790} s={0.9} expression="shocked" look={[-0.7, -0.6]} />
    </>
  );
};

const Rockets: React.FC<SceneProps> = ({ t, at }) => {
  const big = at("enormous") - 0.4;
  const by = t > big ? tween(t, big, big + 2.2, 1560, 700) : 1560;
  return (
    <>
      <Sky top="#141a40" bottom="#7cb6e8" y1={1500} />
      <rect x={0} y={1600} width={1080} height={320} fill="#7a7f8c" />
      <path d="M 0 1600 L 1080 1600" stroke={C.ink} strokeWidth={6} />
      <Rocket x={300 + Math.sin(t * 40) * 4} y={1420 - Math.max(0, Math.sin(t * 2)) * 30} s={1.0} t={t} flame={0.5} />
      <Rocket x={720} y={by} s={1.7 * pop(t, big - 0.6)} t={t} flame={t > big ? 1.2 : 0.2} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={860} r={220} spin={t * 0.25} scale={pop(t, 0.05)} />
    <MoonGround y={1560} />
    <Bolo t={t} x={540} y={1790} s={1.1} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  gravity: Gravity,
  jump: Jump,
  trees: Trees,
  mountains: Mountains,
  rockets: Rockets,
  outro: Outro,
};
