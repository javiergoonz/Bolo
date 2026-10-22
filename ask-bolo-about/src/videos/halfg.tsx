import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Hoop } from "../art/extra";
import { Rain, Tree } from "../art/nature";
import { Ball, Building } from "../art/objects";
import { DaySky, Hills, Sky, SpaceBg } from "../art/sky";
import { tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Guide } from "./common";

const Hook: React.FC<SceneProps> = ({ t }) => {
  const lift = Math.max(0, Math.sin(t * 2)) * 200;
  return (
    <>
      <DaySky />
      <Hills />
      <Bolo t={t} x={540} y={1730} s={1.15} expression="shocked" pose="cheeks" lift={lift} />
    </>
  );
};

const Jumps: React.FC<SceneProps> = ({ t }) => {
  const ph = (t % 1.3) / 1.3;
  const lift = Math.sin(ph * Math.PI) * 560;
  return (
    <>
      <DaySky />
      <rect x={0} y={1500} width={1080} height={420} fill="#d98a4a" />
      <path d="M 0 1500 L 1080 1500" stroke={C.ink} strokeWidth={6} />
      <Hoop x={880} y={1500} s={1.1} />
      <Guide y={1760 - 470 - 280} opacity={0.6} />
      <Bolo t={t} x={460} y={1760} s={1.0} expression="happy" pose={lift > 30 ? "armsUp" : "idle"} lift={lift} />
      <Ball x={460 + 150} y={1760 - 430 - lift} s={0.6} r={t * 200} />
    </>
  );
};

const Tall: React.FC<SceneProps> = ({ t, dur }) => {
  const g = tween(t, 0.3, dur - 0.5, 1, 1.7);
  return (
    <>
      <DaySky />
      <Hills />
      <g transform={`translate(280 1420) scale(0.9 ${g})`}>
        <Tree x={0} y={0} s={1} t={t} />
      </g>
      <Building x={760} y={1500} w={240} h={420 * g} color="#7fa3b3" />
    </>
  );
};

const RainScene: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#4f5b73" bottom="#a3adbf" y1={1200} />
    <Rain t={t * 0.45} y0={300} y1={1200} n={26} />
    <rect x={0} y={1250} width={1080} height={670} fill={C.water} />
    <path d={`M 0 1250 ${Array.from({ length: 12 }, (_, i) => `Q ${i * 90 + 45} ${1250 - 120 * Math.sin(t * 2 + i)} ${i * 90 + 90} 1250`).join(" ")}`} fill={C.water} stroke={C.ink} strokeWidth={6} />
  </>
);

const AirScene: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <circle cx={540} cy={900} r={330} fill="#7fc0ff" opacity={0.3} />
    <Earth x={540} y={900} r={260} spin={t * 0.1} />
    {Array.from({ length: 8 }, (_, i) => {
      const p = (t * 0.3 + i / 8) % 1;
      const a = (i / 8) * Math.PI * 2;
      const d = 300 + p * 300;
      return <circle key={i} cx={540 + Math.cos(a) * d} cy={900 + Math.sin(a) * d} r={14} fill="#bfe8ff" opacity={1 - p} stroke={C.ink} strokeWidth={3} />;
    })}
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, jumps: Jumps, tall: Tall, rain: RainScene, air: AirScene, outro: Outro };
