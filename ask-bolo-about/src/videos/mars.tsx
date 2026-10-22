import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Calendar, MolBubble, SvgText, Thermometer } from "../art/objects";
import { Sky, SpaceBg, Stars, Sun } from "../art/sky";
import { pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";
import { Guide } from "./common";

const MarsGround: React.FC<{ y?: number }> = ({ y = 1300 }) => (
  <>
    <path d={`M -20 ${y} C 300 ${y - 60}, 700 ${y + 50}, 1100 ${y - 30} L 1100 1920 L -20 1920 Z`} fill="#c2552e" />
    <path d={`M -20 ${y} C 300 ${y - 60}, 700 ${y + 50}, 1100 ${y - 30}`} fill="none" stroke={C.ink} strokeWidth={6} />
    {[
      [200, y + 200, 60],
      [760, y + 160, 40],
      [880, y + 420, 70],
      [360, y + 460, 34],
    ].map(([x, yy, r], i) => (
      <ellipse key={i} cx={x} cy={yy} rx={r} ry={r * 0.35} fill="#a8442a" stroke={C.ink} strokeWidth={4} />
    ))}
  </>
);

const MarsSky: React.FC = () => <Sky top="#d9905c" bottom="#f2c49a" y1={1300} />;

const Helmet: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <circle cx={x} cy={y - 270 * s} r={150 * s} fill="#cfefff" fillOpacity={0.25} stroke="#fff" strokeWidth={7} />
);

const Hook: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={800} r={230} variant="mars" spin={t * 0.15} scale={pop(t, 0.05)} />
    <MarsGround y={1520} />
    <Bolo t={t} x={540} y={1770} s={1.1} expression="shocked" pose="cheeks" look={[0, -0.6]} />
  </>
);

const Gravity: React.FC<SceneProps> = ({ t }) => {
  const ph = (t % 1.4) / 1.4;
  const lift = Math.sin(ph * Math.PI) * 520;
  return (
    <>
      <MarsSky />
      <MarsGround />
      <Guide y={1760 - 470 - 520 * 1.0} opacity={0.8} />
      <Helmet x={540} y={1760 - lift} s={1.0} />
      <Bolo t={t} x={540} y={1760} s={1.0} expression="happy" pose={lift > 30 ? "armsUp" : "idle"} lift={lift} />
    </>
  );
};

const Air: React.FC<SceneProps> = ({ t }) => (
  <>
    <MarsSky />
    <MarsGround />
    {[0, 1, 2].map((i) => {
      const p = (t * 0.2 + i / 3) % 1;
      return <MolBubble key={i} x={200 + i * 340} y={1150 - p * 700} s={0.9 * pop(t, 0.3 + i * 0.3)} label="CO2" color="#9aa3b5" opacity={p < 0.8 ? 1 : (1 - p) / 0.2} />;
    })}
    <Helmet x={540} y={1760} s={1.1} />
    <Bolo t={t} x={540} y={1760} s={1.1} expression="worried" />
  </>
);

const Cold: React.FC<SceneProps> = ({ t }) => (
  <>
    <MarsSky />
    <MarsGround />
    <Thermometer x={830} y={1080} s={1.0} hot={false} level={tween(t, 0.3, 2.5, 0.5, 0.08)} />
    <g transform={`translate(380 760) scale(${pop(t, 0.6)})`}>
      <SvgText x={0} y={0} size={120} color="#9fd6ff">
        -60°C
      </SvgText>
    </g>
    <Helmet x={400} y={1760} s={1.05} />
    <Bolo t={t} x={400} y={1760} s={1.05} expression="cold" pose="hold" shiver />
  </>
);

const Day: React.FC<SceneProps> = ({ t }) => (
  <>
    <MarsSky />
    <MarsGround />
    <g transform={`translate(540 860) scale(${pop(t, 0.2)})`}>
      <rect x={-300} y={-120} width={600} height={210} rx={34} fill="#1b2a3a" stroke={C.ink} strokeWidth={8} />
      <SvgText x={0} y={40} size={130} color="#7dffb0">
        24H 39M
      </SvgText>
    </g>
    <Calendar x={860} y={1150} s={0.7} page="1" />
  </>
);

const Sunset: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <Sky top="#2b2f5a" bottom="#c9a27a" y1={1300} />
    <Stars t={t} n={40} maxY={600} />
    <circle cx={540} cy={1180} r={340} fill="#7fc0ff" opacity={0.45} />
    <circle cx={540} cy={1180} r={200} fill="#9fd6ff" opacity={0.5} />
    <Sun x={540} y={tween(t, 0, dur, 1080, 1220)} r={60} t={t} rays={false} />
    <MarsGround y={1260} />
    <Helmet x={540} y={1760} s={1.1} />
    <Bolo t={t} x={540} y={1760} s={1.1} expression="amazed" look={[0, -0.6]} />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <Earth x={540} y={800} r={220} spin={t * 0.25} scale={pop(t, 0.05)} />
    <MarsGround y={1520} />
    <Helmet x={540} y={1770} s={1.1} />
    <Bolo t={t} x={540} y={1770} s={1.1} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, gravity: Gravity, air: Air, cold: Cold, day: Day, sunset: Sunset, outro: Outro };
