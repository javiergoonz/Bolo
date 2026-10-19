import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Rock, Rocket, Thermometer } from "../art/objects";
import { DaySky, Hills, NightSky, SpaceBg, Sun } from "../art/sky";
import { Snow } from "../art/nature";
import { linear, pop, rand, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { MoonGround } from "./common";

/** The rings seen from the ground: a banded arch across the sky. p draws it in. */
const SkyArch: React.FC<{ p: number; glow?: number }> = ({ p, glow = 0 }) => {
  const bands: [number, string, number][] = [
    [0, "#e9d6ab", 46],
    [70, "#cdb487", 34],
    [125, "#f2e4c2", 28],
  ];
  return (
    <g>
      {bands.map(([o, col, w], i) => {
        const d = `M -120 ${1300 - o * 0.2} Q 540 ${80 + o} 1200 ${1300 - o * 0.2}`;
        return (
          <g key={i}>
            {glow > 0 ? <path d={d} fill="none" stroke="#fff6d0" strokeWidth={w + 50} opacity={0.18 * glow} pathLength={1} strokeDasharray={`${p} 1`} /> : null}
            <path d={d} fill="none" stroke={C.ink} strokeWidth={w + 10} pathLength={1} strokeDasharray={`${p} 1`} />
            <path d={d} fill="none" stroke={col} strokeWidth={w} pathLength={1} strokeDasharray={`${p} 1`} />
          </g>
        );
      })}
    </g>
  );
};

const Hook: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={820} r={200} spin={t * 0.2} rings={tween(t, at("rings") - 0.2, at("rings") + 0.5, 0, 1)} />
    <MoonGround />
    <Bolo t={t} x={540} y={1760} s={1.15} expression="shocked" pose="cheeks" look={[0, -0.6]} />
  </>
);

const Arch: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <DaySky />
    <SkyArch p={tween(t, at("huge") - 0.3, at("stretching") + 0.8, 0, 1)} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="amazed" look={[0, -1]} />
  </>
);

const Edge: React.FC<SceneProps> = ({ t, at }) => {
  const p = tween(t, at("thin") - 0.3, at("overhead") + 0.3, 0, 1);
  return (
    <>
      <DaySky />
      <path d={`M 540 1240 L 540 ${1240 - 1240 * p}`} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
      <path d={`M 540 1240 L 540 ${1240 - 1240 * p}`} stroke="#f2e4c2" strokeWidth={10} strokeLinecap="round" />
      <Hills />
      <g transform="translate(860 560)">
        <circle r={150} fill="#ffffff" opacity={0.25} stroke={C.ink} strokeWidth={5} />
        <Earth x={0} y={0} r={70} rings={1} spin={0.3} />
        <circle cx={-70} cy={0} r={13} fill={C.red} stroke={C.ink} strokeWidth={4} transform="rotate(-14)" opacity={pop(t, at("equator"))} />
      </g>
      <Bolo t={t} x={360} y={1750} s={1.15} expression="amazed" look={[0.3, -1]} />
    </>
  );
};

const Shadow: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <SpaceBg t={t} />
    <Sun x={-40} y={820} r={170} t={t} />
    <Earth x={600} y={820} r={240} spin={t * 0.1} rings={1} ringShadow={tween(t, at("shadows") - 0.4, at("shadows") + 0.4, 0, 1)} />
    <g opacity={tween(t, at("winters") - 0.3, at("winters"), 0, 1)}>
      <Snow t={t} n={30} />
    </g>
    <Thermometer x={900} y={1230} s={0.75} hot={false} level={tween(t, at("winters") - 0.3, at("colder") + 0.6, 0.5, 0.12)} />
  </>
);

const Nights: React.FC<SceneProps> = ({ t }) => (
  <>
    <NightSky t={t} />
    <SkyArch p={1} glow={1} />
    <Hills color="#1d5a26" back="#256a2e" />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="smile" look={[0, -1]} />
  </>
);

const Rockets: React.FC<SceneProps> = ({ t }) => {
  const y = linear(t, 0, 4, 1250, 650);
  const dodge = Math.sin(t * 3) * 90;
  return (
    <>
      <SpaceBg t={t} />
      <Earth x={540} y={2350} r={900} spin={t * 0.02} />
      {Array.from({ length: 14 }, (_, i) => {
        const lane = 520 + (i % 4) * 120;
        const x = ((rand(i) * 1400 + t * (220 + rand(i + 4) * 200) * (i % 2 ? 1 : -1)) % 1400 + 1400) % 1400 - 160;
        return <Rock key={i} x={x} y={lane + rand(i + 7) * 60} s={0.9 + rand(i + 2) * 1.2} r={t * 60 + i * 30} />;
      })}
      <Rocket x={540 + dodge} y={y} s={0.85} r={Math.cos(t * 3) * 14} t={t} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <NightSky t={t} />
    <SkyArch p={1} glow={0.6} />
    <Hills color="#1d5a26" back="#256a2e" />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="shrug" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  arch: Arch,
  edge: Edge,
  shadow: Shadow,
  nights: Nights,
  rockets: Rockets,
  outro: Outro,
};
