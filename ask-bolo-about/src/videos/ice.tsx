import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Fish, Penguin, PolarBear } from "../art/animals";
import { Iceberg } from "../art/nature";
import { Arrow, Building, City, Hourglass, Ruler } from "../art/objects";
import { DaySky, FlatGround, Sky, Split, Sun } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C, H, W } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Sea: React.FC<{ y: number; t: number; color?: string; opacity?: number }> = ({ y, t, color = C.water, opacity = 0.95 }) => {
  const wv = Math.sin(t * 1.8) * 6;
  return (
    <>
      <rect x={-20} y={y + wv} width={W + 40} height={H} fill={color} opacity={opacity} />
      <path d={`M -20 ${y + wv} L ${W + 20} ${y + wv}`} stroke={C.ink} strokeWidth={6} />
      <rect x={-20} y={y + wv + 4} width={W + 40} height={24} fill="#fff" opacity={0.2} />
    </>
  );
};

const PolarSky: React.FC = () => <Sky top="#8fd3ff" bottom="#e6f6ff" y1={1200} />;

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const melt = tween(t, at("melted") - 0.6, at("melted") + 0.6, 0, 0.7);
  return (
    <>
      <PolarSky />
      <Sun x={240} y={620} r={80} t={t} />
      <Iceberg x={720} y={1180} s={1.5} melt={melt} />
      <Sea y={1180} t={t} />
      <FlatGround y={1560} color={C.snow} />
      <Bolo t={t} x={360} y={1770} s={1.15} expression="shocked" pose="cheeks" />
    </>
  );
};

const Rise: React.FC<SceneProps> = ({ t, at }) => {
  const level = tween(t, at("rise") - 0.4, at("meters") + 0.4, 1700, 860);
  return (
    <>
      <DaySky />
      <rect x={0} y={1700} width={W} height={220} fill="#6b8a44" />
      <Building x={700} y={1700} w={230} h={860} color="#b38a7f" />
      <Ruler x={190} y0={1700} y1={760} marks={["10M", "20M", "30M", "40M", "50M", "60M", "70M"]} />
      <Sea y={level} t={t} opacity={0.8} />
      <Fish x={520} y={Math.max(level + 120, 1500)} s={1.1} t={t} opacity={level < 1500 ? 1 : 0} />
    </>
  );
};

const Cities: React.FC<SceneProps> = ({ t, at }) => {
  const level = tween(t, 0, at("underwater") + 0.5, 1500, 1120);
  return (
    <>
      <DaySky />
      <City y={1500} />
      <Bolo t={t} x={300} y={880} s={0.6} expression="worried" look={[0.4, 0.6]} />
      <Sea y={level} t={t} opacity={0.82} />
      <Fish x={420 + Math.sin(t) * 60} y={1380} s={1.2} t={t} flip />
      <Fish x={820 - Math.sin(t) * 60} y={1560} s={1} t={t} color="#ffd23f" />
    </>
  );
};

const Animals: React.FC<SceneProps> = ({ t, dur }) => {
  const melt = linear(t, 0.2, dur, 0, 0.6);
  return (
    <>
      <PolarSky />
      <Sun x={880} y={500} r={80} t={t} />
      <Iceberg x={300} y={1150} s={1.3 * (1 - melt * 0.4)} melt={melt * 0.5} />
      <PolarBear x={330} y={1150 - 120 * (1 - melt * 0.3)} s={0.9} t={t} sad />
      <Iceberg x={800} y={1210} s={0.9 * (1 - melt * 0.4)} melt={melt * 0.5} />
      <Penguin x={800} y={1210 - 80 * (1 - melt * 0.3)} s={1.0} t={t} />
      <Sea y={1150} t={t} opacity={0.88} />
    </>
  );
};

const Warmer: React.FC<SceneProps> = ({ t, at }) => {
  const a = linear(t, 0.2, 1.0, 0, 1);
  const b = linear(t, at("heat") - 0.5, at("heat"), 0, 1);
  return (
    <>
      <Split
        left={
          <>
            <PolarSky />
            <FlatGround y={1250} color={C.snow} />
          </>
        }
        right={
          <>
            <Sky top="#7cb6e8" bottom="#c8e4fa" y1={1200} />
            <rect x={540} y={1250} width={540} height={700} fill={C.waterDark} />
            <path d="M 540 1250 L 1080 1250" stroke={C.ink} strokeWidth={6} />
            <ellipse cx={810} cy={1360} rx={200} ry={70} fill="#ff6a3d" opacity={0.35 * b} />
          </>
        }
      />
      <Sun x={540} y={480} r={110} t={t} />
      <Arrow x1={330} y1={620} x2={260} y2={1220} color={C.yellow} opacity={a} />
      <Arrow x1={240} y1={1220} x2={110} y2={700} color={C.yellow} opacity={linear(t, 0.9, 1.4, 0, 1)} />
      <Arrow x1={750} y1={620} x2={820} y2={1300} color={C.yellow} opacity={a} />
    </>
  );
};

const Slow: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <PolarSky />
    <Iceberg x={540} y={1250} s={1.9} />
    <Sea y={1250} t={t} />
    <Hourglass x={540} y={780} s={1.25 * pop(t, 0.1)} progress={linear(t, 0.2, dur, 0, 0.8)} />
    <Bolo t={t} x={830} y={1780} s={0.95} expression="smile" />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <PolarSky />
    <Iceberg x={760} y={1180} s={1.4} />
    <Penguin x={770} y={1060} s={0.9} t={t} />
    <Sea y={1180} t={t} />
    <FlatGround y={1560} color={C.snow} />
    <Bolo t={t} x={420} y={1770} s={1.15} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  rise: Rise,
  cities: Cities,
  animals: Animals,
  warmer: Warmer,
  slow: Slow,
  outro: Outro,
};
