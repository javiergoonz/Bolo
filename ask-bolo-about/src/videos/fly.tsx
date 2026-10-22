import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Bird } from "../art/animals";
import { House, Plate, TrafficLight, Wings } from "../art/extra";
import { Snow } from "../art/nature";
import { Apple, Car, Thermometer } from "../art/objects";
import { Cloud, DaySky, Hills, Sky } from "../art/sky";
import { pop, tween } from "../engine/anim";
import type { SceneMap, SceneProps } from "../engine/types";

const Flyer: React.FC<{ t: number; x: number; y: number; s?: number; expression?: "happy" | "amazed" | "cold" | "tired" | "shocked" | "smile" }> = ({
  t,
  x,
  y,
  s = 1,
  expression = "happy",
}) => (
  <g>
    <Wings x={x} y={y - 290 * s} s={s} t={t} />
    <Bolo t={t} x={x} y={y + Math.sin(t * 3) * 14} s={s} expression={expression} pose="armsUp" shiver={expression === "cold"} />
  </g>
);

const Hook: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <DaySky />
    <Cloud x={240} y={680} s={1.1} />
    <Hills />
    <Flyer t={t} x={540} y={tween(t, 0.4, dur, 1730, 1500)} s={1.15} expression="shocked" />
  </>
);

const Roads: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Cloud x={820} y={520} s={1.0} />
    <Hills y={1150} />
    <rect x={0} y={1350} width={1080} height={260} fill="#555a66" />
    <path d="M 0 1350 L 1080 1350 M 0 1610 L 1080 1610" stroke="#24170f" strokeWidth={6} />
    <Car x={180} y={1560} s={0.9} opacity={0.5} />
    <House x={850} y={1320} s={0.7} />
    <Flyer t={t} x={(t * 140) % 1300 - 100} y={1100} s={0.75} />
  </>
);

const Traffic: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#8fd3ff" bottom="#d6f0ff" />
    <Cloud x={540} y={1050} s={2.2} />
    <TrafficLight x={540} y={880} s={1.2 * pop(t, 0.3)} color={t % 2 < 1 ? "red" : "green"} />
    <Flyer t={t} x={(t * 120) % 1300 - 100} y={700} s={0.55} />
    <Flyer t={t + 1} x={1180 - ((t * 150) % 1300)} y={560} s={0.5} expression="amazed" />
    <Bird x={(t * 200) % 1300 - 100} y={420} s={0.8} t={t} flip />
  </>
);

const Cold: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#2b3f8a" bottom="#8fb8e8" />
    <Cloud x={250} y={1500} s={1.6} />
    <Cloud x={820} y={1580} s={1.3} />
    <Snow t={t} n={36} />
    <Thermometer x={880} y={900} s={0.9} hot={false} level={tween(t, 0.2, 2.5, 0.6, 0.1)} />
    <Flyer t={t} x={420} y={1250} s={1.0} expression="cold" />
  </>
);

const Food: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#fff2cf" bottom="#ffd9a0" />
    <rect x={0} y={1400} width={1080} height={520} fill="#e8b97a" />
    <Plate x={540} y={1050} s={1.2 * pop(t, 0.2)} />
    <Apple x={300} y={900} s={pop(t, 0.6)} />
    <Apple x={780} y={900} s={pop(t, 0.9)} r={20} />
    <Flyer t={t} x={540} y={1760} s={0.9} expression="tired" />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Cloud x={240} y={680} s={1.1} />
    <Hills />
    <Flyer t={t} x={540} y={1600} s={1.1} />
  </>
);

export const scenes: SceneMap = { hook: Hook, roads: Roads, traffic: Traffic, cold: Cold, food: Food, outro: Outro };
