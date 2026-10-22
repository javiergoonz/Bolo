import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Frog, House, Mushroom, Snail } from "../art/extra";
import { Cactus, Flower, Rain } from "../art/nature";
import { Cloud, Hills, Sky, Split } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const Gray: React.FC<{ t: number; n?: number }> = ({ t, n = 34 }) => (
  <>
    <Sky top="#4f5b73" bottom="#a3adbf" y1={1300} />
    <Cloud x={220} y={300} s={1.6} color="#cfd4dc" />
    <Cloud x={820} y={380} s={1.4} color="#bfc6d2" />
    <Rain t={t} y0={420} y1={1700} n={n} />
  </>
);

const Hook: React.FC<SceneProps> = ({ t }) => (
  <>
    <Gray t={t} />
    <Hills color="#3f7a3a" back="#4a8a44" />
    <Bolo t={t} x={540} y={1730} s={1.2} expression="shocked" pose="cheeks" />
  </>
);

const Floods: React.FC<SceneProps> = ({ t, dur }) => {
  const w = tween(t, 0.3, dur, 1700, 1250);
  return (
    <>
      <Gray t={t} />
      <Hills color="#3f7a3a" back="#4a8a44" />
      <House x={300} y={1500} s={0.9} />
      <House x={800} y={1480} s={0.8} color="#9fc6e6" />
      <rect x={0} y={w} width={1080} height={1920} fill="#6f8fb0" opacity={0.85} />
      <path d={`M 0 ${w} L 1080 ${w}`} stroke={C.ink} strokeWidth={6} />
    </>
  );
};

const Sun: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <Gray t={t} n={20} />
    <Hills color="#5d7a3a" back="#6b8a44" />
    {[200, 420, 660, 880].map((x, i) => (
      <Flower key={x} x={x} y={1440} s={1.1} t={t} color={["#ff6f91", "#ffb02e", "#b06fff", "#ff6f91"][i]} droop={linear(t, 0.5, dur, 0, 0.7)} />
    ))}
  </>
);

const Mold: React.FC<SceneProps> = ({ t }) => (
  <>
    <Gray t={t} n={18} />
    <Hills color="#4f6b34" back="#5a7a3c" />
    {[
      [160, 1400, 1.0, "#e8473f"],
      [360, 1350, 0.7, "#c98b4b"],
      [800, 1380, 1.2, "#e8473f"],
      [950, 1450, 0.8, "#b06fff"],
    ].map(([x, y, s, c], i) => (
      <Mushroom key={i} x={x as number} y={y as number} s={(s as number) * pop(t, 0.3 + i * 0.35)} color={c as string} />
    ))}
    <Bolo t={t} x={560} y={1760} s={1.05} expression="worried" />
  </>
);

const Frogs: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Split
      left={
        <>
          <Gray t={t} n={16} />
          <Hills color="#3f7a3a" back="#4a8a44" />
        </>
      }
      right={
        <>
          <Gray t={t} n={16} />
          <rect x={540} y={1250} width={540} height={700} fill="#e4a95c" />
        </>
      }
    />
    <Frog x={260} y={1450} s={1.3} t={t} />
    <Snail x={200} y={1700} s={1.0} t={t} />
    <Cactus x={810} y={1500} s={1.1 * tween(t, at("desert") - 0.3, at("desert") + 0.3, 1, 0.9)} />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#7cd0f7" bottom="#cdeffd" y1={1300} />
    <g transform={`translate(800 480) scale(${pop(t, 0.1)})`}>
      <circle r={100} fill="#ffd23f" stroke={C.ink} strokeWidth={6} />
    </g>
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, floods: Floods, sun: Sun, mold: Mold, frogs: Frogs, outro: Outro };
