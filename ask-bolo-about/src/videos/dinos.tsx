import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Earth } from "../art/earth";
import { Bird, Mouse, Sauropod, TRex } from "../art/animals";
import { GrassTuft, Tree } from "../art/nature";
import { Asteroid, Check, QuestionMark } from "../art/objects";
import { Hills, Sky, SpaceBg, Sun } from "../art/sky";
import { linear, pop, tween } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const JurassicSky: React.FC = () => <Sky top="#ffb36b" bottom="#ffe6b0" y1={1300} />;

const Volcano: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const p = (t * 0.3 + i / 3) % 1;
      return <circle key={i} cx={Math.sin(i + t) * 20} cy={-380 - p * 260} r={40 + p * 50} fill="#6b5d66" opacity={0.6 * (1 - p)} />;
    })}
    <path d="M -300 0 L -80 -380 L 80 -380 L 300 0 Z" fill="#7a5a4a" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -80 -380 L 80 -380 L 60 -330 L 20 -350 L -10 -310 L -40 -350 L -70 -330 Z" fill="#ff7a2f" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

const Hook: React.FC<SceneProps> = ({ t }) => (
  <>
    <JurassicSky />
    <Volcano x={820} y={1250} t={t} s={0.9} />
    <Sauropod x={300} y={1260 + tween(t, 0.3, 1.2, 300, 0)} s={1.1} t={t} />
    <Hills />
    <Bolo t={t} x={560} y={1740} s={1.2} expression="shocked" pose="cheeks" look={[-0.5, -0.5]} />
  </>
);

const Miss: React.FC<SceneProps> = ({ t, at, dur }) => {
  const p = tween(t, 0.2, at("missed") + 0.4, 0, 1, (n) => n);
  const ax = linear(p, 0, 1, 1250, -250);
  const ay = linear(p, 0, 1, 180, 980);
  return (
    <>
      <SpaceBg t={t} />
      <Earth x={640} y={1000} r={220} spin={t * 0.1} />
      <Asteroid x={ax} y={ay} s={1.3} r={-8} spin={t * 90} trail={1} />
      <Check x={640} y={1000} s={pop(t, Math.min(dur - 0.8, at("missed") + 0.5))} />
    </>
  );
};

const Rule: React.FC<SceneProps> = ({ t }) => (
  <>
    <JurassicSky />
    <Sun x={200} y={480} r={80} t={t} />
    <Volcano x={860} y={1240} t={t} s={0.8} />
    <Hills color="#3f8a3a" back="#4f9a44" />
    <Tree x={120} y={1340} s={0.9} t={t} color="#2f9a5a" />
    <Sauropod x={360 + t * 25} y={1500} s={1.15} t={t} />
    <TRex x={860 - t * 20} y={1720} s={1.0} t={t} />
  </>
);

const Mammals: React.FC<SceneProps> = ({ t }) => (
  <>
    <JurassicSky />
    <rect x={0} y={900} width={1080} height={1020} fill="#7a4e2c" />
    <path d="M 0 900 L 1080 900" stroke={C.ink} strokeWidth={6} />
    <rect x={0} y={870} width={1080} height={34} fill="#3f8a3a" stroke={C.ink} strokeWidth={5} />
    {[120, 400, 650, 960].map((x) => (
      <GrassTuft key={x} x={x} y={875} s={1.2} />
    ))}
    <TRex x={700 - t * 40} y={885} s={1.4} t={t} />
    <path d="M 320 905 C 300 1000, 420 1050, 460 1120" fill="none" stroke="#4a2e18" strokeWidth={70} strokeLinecap="round" />
    <ellipse cx={540} cy={1160} rx={210} ry={110} fill="#4a2e18" stroke={C.ink} strokeWidth={6} />
    <Mouse x={560} y={1235} s={1.2} t={t} />
  </>
);

const Humans: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <JurassicSky />
    <Hills color="#3f8a3a" back="#4f9a44" />
    <Sauropod x={150} y={1290} s={0.55} t={t} />
    <TRex x={940} y={1300} s={0.45} t={t} flip />
    <QuestionMark x={300} y={760} t={t} s={1.3 * pop(t, at("humans"))} />
    <QuestionMark x={780} y={700} t={t} s={1.6 * pop(t, at("never"))} />
    <QuestionMark x={540} y={560} t={t} s={1.1 * pop(t, at("appeared"))} />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="worried" pose="shrug" />
  </>
);

const Birds: React.FC<SceneProps> = ({ t, at }) => (
  <>
    <Sky top="#7cd0f7" bottom="#cdeffd" y1={1300} />
    <Hills />
    <g opacity={tween(t, at("dinosaurs") - 0.4, at("dinosaurs") + 0.3, 0, 0.35)}>
      <TRex x={560} y={1220} s={2.6} t={0} color="#ffffff" />
    </g>
    <path d="M 120 1000 L 960 1000" stroke={C.ink} strokeWidth={24} strokeLinecap="round" />
    <path d="M 120 1000 L 960 1000" stroke={C.trunk} strokeWidth={14} strokeLinecap="round" />
    <Bird x={540} y={910} s={1.7} t={t * 0.15} />
    <Bolo t={t} x={830} y={1760} s={1.0} expression="amazed" look={[-0.6, -0.7]} />
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <SpaceBg t={t} />
    <Asteroid x={820} y={600} s={1.3} spin={t * 30} />
    <Hills />
    <Bolo t={t} x={480} y={1740} s={1.2} expression="happy" pose="shrug" look={[0.6, -0.7]} />
  </>
);

export const scenes: SceneMap = {
  hook: Hook,
  miss: Miss,
  rule: Rule,
  mammals: Mammals,
  humans: Humans,
  birds: Birds,
  outro: Outro,
};
