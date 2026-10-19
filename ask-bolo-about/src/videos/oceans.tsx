import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Fish } from "../art/animals";
import { Bubbles, Cactus, Cracks, Dune, Mountain, Plankton, Rain } from "../art/nature";
import { Arrow, MolBubble, SvgText } from "../art/objects";
import { Cloud, ColdSide, DaySky, HotSide, Sky, Split, Sun, Underwater } from "../art/sky";
import { linear, pop, rand, tween } from "../engine/anim";
import { C, H, W } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Seabed: React.FC<{ y: number }> = ({ y }) => (
  <>
    <path d={`M -20 ${y} C 300 ${y + 260}, 780 ${y + 260}, 1100 ${y} L 1100 ${H} L -20 ${H} Z`} fill="#b98a55" stroke={C.ink} strokeWidth={6} />
  </>
);

const Water: React.FC<{ y: number; t: number }> = ({ y, t }) => {
  const wv = Math.sin(t * 1.8) * 6;
  return (
    <>
      <rect x={-20} y={y + wv} width={W + 40} height={H} fill={C.water} opacity={0.94} />
      <path d={`M -20 ${y + wv} L ${W + 20} ${y + wv}`} stroke={C.ink} strokeWidth={6} />
      <rect x={-20} y={y + wv + 4} width={W + 40} height={24} fill="#fff" opacity={0.2} />
    </>
  );
};

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const level = tween(t, at("dried") - 0.5, at("dried") + 0.6, 1100, 1560);
  return (
    <>
      <DaySky />
      <Sun x={850} y={520} r={80} t={t} />
      <Seabed y={1100} />
      <Water y={level} t={t} />
      <Fish x={760} y={Math.max(level + 90, 1420)} s={1} t={t} r={level > 1400 ? 70 : 0} />
      <path d="M -20 1560 L 1100 1560 L 1100 1920 L -20 1920 Z" fill={C.sand} stroke={C.ink} strokeWidth={6} />
      <Bolo t={t} x={360} y={1780} s={1.15} expression="shocked" pose="cheeks" />
    </>
  );
};

const RainScene: React.FC<SceneProps> = ({ t, at }) => {
  const dry = tween(t, at("stop") - 0.2, at("stop") + 0.8, 0, 1);
  return (
    <>
      <Sky top="#7cb6e8" bottom="#d8eefc" y1={1300} />
      <Sun x={150} y={380} r={80} t={t} />
      <Seabed y={1150} />
      <g opacity={1 - dry}>
        <Water y={1150} t={t} />
      </g>
      <Rain t={t} x0={560} x1={960} y0={760} y1={1250} n={14} opacity={1 - dry} />
      <g transform={`translate(760 640) scale(${1 - dry * 0.45})`}>
        <Cloud x={0} y={0} s={1.5} color={dry > 0.5 ? "#e4e8ef" : "#ffffff"} />
      </g>
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={220 + i * 130} y1={1100} x2={330 + i * 130} y2={780} color="#bfe8ff" w={12} opacity={(1 - dry) * 0.9} />
      ))}
      <g opacity={linear(t, at("evaporates") - 0.4, at("evaporates"), 0, 1)}>
        <SvgText x={540} y={1080} size={60} color="#bfe8ff">
          NO OCEAN, NO RAIN
        </SvgText>
      </g>
    </>
  );
};

const Desert: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#ff9a3c" bottom="#ffd78a" y1={1300} />
    <Sun x={820} y={460} r={110} t={t} />
    <Dune x={200} y={1220} w={700} />
    <Dune x={900} y={1250} w={600} color="#e9a44f" />
    <rect x={-10} y={1220} width={1100} height={720} fill="#e4a95c" />
    <path d="M -10 1220 L 1090 1220" stroke={C.ink} strokeWidth={6} />
    <path d="M -10 1320 C 300 1290, 500 1400, 1090 1330 L 1090 1400 C 600 1460, 300 1370, -10 1400 Z" fill="#b98049" opacity={linear(t, at("dry") - 0.3, at("dry") + 0.5, 0, 1)} />
    <Cracks y={1240} opacity={linear(t, at("desert") - 0.6, at("desert"), 0, 1)} />
    <Cactus x={180} y={1300} s={1.2} />
    <Cactus x={940} y={1280} s={0.9} />
    <Bolo t={t} x={560} y={1780} s={1.05} expression="hot" />
  </>
);

const Temps: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Split left={<HotSide t={t} />} right={<ColdSide t={t} />} />
    <g transform={`translate(270 560) scale(${pop(t, at("days") - 0.1)})`}>
      <SvgText x={0} y={0} size={76} color={C.yellow}>
        DAY
      </SvgText>
    </g>
    <g transform={`translate(810 560) scale(${pop(t, at("nights") - 0.1)})`}>
      <SvgText x={0} y={0} size={76} color="#d6ecff">
        NIGHT
      </SvgText>
    </g>
    <Bolo t={t} x={270} y={1760} s={0.95} expression="hot" />
    <Bolo t={t} x={810} y={1760} s={0.95} expression="cold" pose="hold" shiver />
  </>
);

const Oxygen: React.FC<SceneProps> = ({ t, at, dur }) => {
  const fade = (i: number) => tween(t, at("lose") + i * 0.12, at("lose") + 0.5 + i * 0.12, 1, 0);
  return (
    <>
      <Underwater t={t} />
      {Array.from({ length: 14 }, (_, i) => (
        <Plankton key={i} x={80 + rand(i + 4) * 920} y={560 + rand(i + 40) * 900} s={0.9 + rand(i) * 0.6} t={t} opacity={fade(i)} />
      ))}
      {[0, 1].map((i) => {
        const p = (t * 0.22 + i * 0.5) % 1;
        return <MolBubble key={i} x={330 + i * 420} y={1450 - p * 1000} s={0.9 * linear(t, dur - 1.6, dur - 0.6, 1, 0.3)} label="O2" opacity={p < 0.85 ? 1 : (1 - p) / 0.15} />;
      })}
      <Bubbles t={t} x={540} y={1500} h={900} n={6} spread={700} />
    </>
  );
};

const Trench: React.FC<SceneProps> = ({ t, at, dur }) => {
  const p = linear(t, 0.3, dur, 0, 1);
  const by = 760 + p * 900;
  const bx = 375 + (by - 700) * 0.107; // follows the trench wall
  return (
    <>
      <Sky top="#7cb6e8" bottom="#d8eefc" y1={800} />
      <path d="M -20 700 L 330 700 L 450 1820 L 630 1820 L 750 700 L 1100 700 L 1100 1920 L -20 1920 Z" fill="#b98a55" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 330 700 L 450 1820 L 630 1820 L 750 700 Z" fill="#6e4c2c" opacity={0.25} />
      <g opacity={pop(t, at("Mariana") + 0.3)}>
        <Mountain x={540} y={1820} w={300} h={820} color="#9aa3b5" />
      </g>
      <g opacity={linear(t, at("eleven") - 0.3, at("eleven"), 0, 1)}>
        <path d="M 900 700 L 900 1820" stroke="#fff" strokeWidth={8} strokeDasharray="24 16" />
        <SvgText x={900} y={1290} size={64} color={C.yellow}>
          11 KM
        </SvgText>
      </g>
      <Bolo t={t} x={bx} y={by} s={0.45} expression="amazed" pose="run" look={[0, 1]} />
    </>
  );
};

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Sun x={850} y={520} r={80} t={t} />
    <Water y={1150} t={t} />
    <Fish x={300 + ((t * 120) % 500)} y={1300} s={1} t={t} flip />
    <Fish x={800 - ((t * 90) % 400)} y={1440} s={0.8} t={t} color="#ffd23f" />
    <path d="M -20 1560 L 1100 1560 L 1100 1920 L -20 1920 Z" fill={C.sand} stroke={C.ink} strokeWidth={6} />
    <Bolo t={t} x={540} y={1780} s={1.15} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  rain: RainScene,
  desert: Desert,
  temps: Temps,
  oxygen: Oxygen,
  trench: Trench,
  outro: Outro,
};
