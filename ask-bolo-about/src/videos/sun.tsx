import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Flower, Microbe, Snow, Vent } from "../art/nature";
import { SvgText, Thermometer } from "../art/objects";
import { DaySky, FlatGround, Hills, Moon, NightSky, Sky, SpaceBg, Stars, Sun, Underwater } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Poof } from "./common";

const Hook: React.FC<SceneProps> = ({ t, at }) => {
  const gone = at("disappeared") + 0.25;
  const k = tween(t, gone, gone + 0.35, 1, 0);
  const dark = linear(t, gone, gone + 0.6, 0, 0.6);
  return (
    <>
      <DaySky />
      <rect width={1080} height={1920} fill="#0b1035" opacity={dark} />
      <Sun x={800} y={640} r={100} t={t} scale={k * pop(t, 0.05)} />
      <Poof x={800} y={640} p={linear(t, gone, gone + 0.6, 0, 1)} />
      <Hills />
      <Bolo t={t} x={540} y={1730} s={1.2} expression="shocked" pose="cheeks" />
    </>
  );
};

const Delay: React.FC<SceneProps> = ({ t, dur }) => {
  const p = linear(t, 0.2, dur - 0.4, 0, 1);
  const secs = Math.floor(p * 500);
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <>
      <SpaceBg t={t} />
      <Sun x={120} y={860} r={150} t={t} />
      <Earth x={880} y={860} r={110} spin={t * 0.15} />
      {Array.from({ length: 7 }, (_, i) => {
        const u = (t * 0.45 + i / 7) % 1;
        return <circle key={i} cx={290 + u * 470} cy={860} r={13} fill={C.yellow} stroke={C.ink} strokeWidth={4} opacity={u < 0.95 ? 1 : 0} />;
      })}
      <g transform="translate(540 1080)">
        <rect x={-180} y={-80} width={360} height={140} rx={28} fill="#1b2a3a" stroke={C.ink} strokeWidth={7} />
        <SvgText x={0} y={35} size={104} color="#7dffb0">
          {clock}
        </SvgText>
      </g>
    </>
  );
};

const Dark: React.FC<SceneProps> = ({ t, at }) => {
  const black = linear(t, 0.1, 1.0, 0, 0.55);
  const vanish = at("vanish");
  return (
    <>
      <NightSky t={t} />
      <rect width={1080} height={1920} fill="#000" opacity={black} />
      <Moon x={780} y={560} r={90} opacity={tween(t, vanish, vanish + 0.8, 1, 0)} />
      <Hills color="#123d17" back="#184d1d" />
      <rect width={1080} height={1920} fill="#000" opacity={black * 0.5} />
      <Bolo t={t} x={420} y={1730} s={1.2} expression="grit" pose="flashlight" look={[0.6, 0]} />
    </>
  );
};

const Plants: React.FC<SceneProps> = ({ t, at }) => {
  const d0 = at("stop");
  const d1 = at("die") + 0.4;
  return (
    <>
      <Sky top="#2b3050" bottom="#5a5f7a" y1={1300} />
      <Stars t={t} n={40} />
      <Hills color="#4f5e2f" back="#5d6b38" line="#26301a" />
      {[180, 410, 640].map((x, i) => (
        <Flower key={x} x={x} y={1400} s={1.25} t={t} color={["#ff6f91", "#ffb02e", "#b06fff"][i]} droop={linear(t, d0 + i * 0.3, d1 + i * 0.3, 0, 1)} />
      ))}
      <Bolo t={t} x={860} y={1750} s={0.95} expression="sad" look={[-0.7, 0.2]} />
    </>
  );
};

const Drift: React.FC<SceneProps> = ({ t, dur }) => {
  const cx = 540;
  const cy = 860;
  const R = 300;
  const tv = 0.7;
  const w = 0.6;
  const th = (tt: number) => 1.6 - tt * w;
  const rx = cx + R * Math.cos(th(tv));
  const ry = cy + R * Math.sin(th(tv));
  // Before the Sun vanishes Earth orbits; afterwards it drifts off in a straight line.
  const ex = t < tv ? cx + R * Math.cos(th(t)) : linear(t, tv, dur, rx, 960);
  const ey = t < tv ? cy + R * Math.sin(th(t)) : linear(t, tv, dur, ry, 1010);
  const sunOp = tween(t, 0.15, 0.6, 1, 0);
  return (
    <>
      <SpaceBg t={t} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="18 18" opacity={0.5 * sunOp + 0.15} />
      <Sun x={cx} y={cy} r={110} t={t} opacity={sunOp} />
      <Poof x={cx} y={cy} p={linear(t, 0.3, 0.9, 0, 1)} s={1.3} />
      {t > tv ? <path d={`M ${rx} ${ry} L ${ex} ${ey}`} stroke="#fff" strokeWidth={5} strokeDasharray="14 14" opacity={0.6} /> : null}
      <Earth x={ex} y={ey} r={95} spin={t * 0.2} scale={linear(t, tv, dur, 1, 0.6)} />
    </>
  );
};

const Cold: React.FC<SceneProps> = ({ t, at }) => {
  const freeze = at("freeze");
  const ice = linear(t, freeze - 0.2, freeze + 0.8, 0, 1);
  return (
    <>
      <Sky top="#141a33" bottom="#46557a" y1={1200} />
      <Stars t={t} n={60} maxY={900} />
      <rect x={0} y={1120} width={1080} height={420} fill={C.water} />
      <rect x={0} y={1120} width={1080} height={420} fill="#e6f5ff" opacity={ice} />
      {ice > 0.2 ? (
        <path d="M 120 1200 L 260 1260 L 240 1330 M 640 1180 L 700 1290 L 820 1320 M 900 1240 L 980 1300" stroke="#9fc6e6" strokeWidth={6} fill="none" opacity={ice} />
      ) : null}
      <path d="M 0 1120 L 1080 1120" stroke={C.ink} strokeWidth={6} />
      <FlatGround y={1540} color={C.snow} />
      <Snow t={t} n={50} />
      <Thermometer x={890} y={1040} s={1.05} level={linear(t, 0.3, 4.5, 0.55, 0.06)} hot={false} />
      <Bolo t={t} x={420} y={1760} s={1.15} expression="cold" pose="hold" shiver />
    </>
  );
};

const Vents: React.FC<SceneProps> = ({ t }) => (
  <>
    <Underwater t={t} top="#0f2f52" bottom="#02060f" floor={1640} />
    <path d="M 0 0 L 1080 0 L 1080 380 L 960 420 L 840 370 L 700 430 L 560 380 L 420 440 L 280 380 L 140 430 L 0 390 Z" fill="#e6f5ff" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <Vent x={540} y={1680} s={1.35} t={t} />
    <circle cx={540} cy={1440} r={260} fill="#ff7a2f" opacity={0.08} />
    {[
      [300, 1180, "#ff9ad5"],
      [780, 1120, "#9ae6ff"],
      [380, 1500, "#b8ff9a"],
      [740, 1480, "#ffd36a"],
      [560, 1000, "#ff9ad5"],
    ].map(([x, y, col], i) => (
      <Microbe key={i} x={x as number} y={y as number} s={1.5} t={t + i} color={col as string} />
    ))}
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <DaySky />
    <Sun x={540} y={760} r={120} t={t} scale={pop(t, 0.1)} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  delay: Delay,
  dark: Dark,
  plants: Plants,
  drift: Drift,
  cold: Cold,
  vents: Vents,
  outro: Outro,
};
