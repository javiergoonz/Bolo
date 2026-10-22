import React from "react";
import { Bolo } from "../bolo/Bolo";
import { Bear, Greenhouse, House, Snowman } from "../art/extra";
import { Snow, Wheat } from "../art/nature";
import { Car, Cross, SvgText } from "../art/objects";
import { Hills, Sky, Sun } from "../art/sky";
import { pop } from "../engine/anim";
import { C } from "../engine/theme";
import type { SceneMap, SceneProps } from "../engine/types";

const WinterSky: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky top="#8fb8e8" bottom="#e6f2ff" y1={1300} />
    <Snow t={t} n={40} />
  </>
);
const SnowHills: React.FC = () => <Hills color="#f2f8ff" back="#e0ecf8" line="#24170f" />;

const Hook: React.FC<SceneProps> = ({ t }) => (
  <>
    <WinterSky t={t} />
    <SnowHills />
    <Snowman x={850} y={1420} s={0.8} t={t} />
    <Bolo t={t} x={460} y={1740} s={1.2} expression="shocked" pose="cheeks" />
  </>
);

const Crops: React.FC<SceneProps> = ({ t }) => (
  <>
    <WinterSky t={t} />
    <SnowHills />
    {[120, 260, 400].map((x) => (
      <Wheat key={x} x={x} y={1450} s={0.9} t={t} opacity={0.5} />
    ))}
    <Cross x={260} y={1150} s={0.8 * pop(t, 0.8)} />
    <Greenhouse x={780} y={1450} s={1.1 * pop(t, 2.2)} />
  </>
);

const Bears: React.FC<SceneProps> = ({ t, dur }) => (
  <>
    <WinterSky t={t} />
    <SnowHills />
    <path d="M 260 1500 Q 540 950 820 1500 Z" fill="#6b5d56" stroke={C.ink} strokeWidth={6} />
    <path d="M 360 1500 Q 540 1150 720 1500 Z" fill="#2b2420" />
    <Bear x={600} y={1490} s={0.85} t={t} sleeping={t < dur * 0.6} />
    <g opacity={t < dur * 0.6 ? 1 : 0}>
      <SvgText x={420} y={1200 - (t * 40) % 80} size={70} color="#fff">
        Z
      </SvgText>
    </g>
  </>
);

const SnowDays: React.FC<SceneProps> = ({ t }) => (
  <>
    <WinterSky t={t} />
    <SnowHills />
    <Snowman x={240} y={1460} s={0.9} t={t} />
    <Car x={780} y={1500} s={0.9} wheel={t * 200} />
    <Bolo t={t} x={560} y={1760} s={1.05} expression="happy" pose="armsUp" />
  </>
);

const Heat: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#2b3f8a" bottom="#8fb8e8" y1={1300} />
    <Snow t={t} n={36} />
    <SnowHills />
    <House x={300} y={1450} s={0.9} t={t} smoke />
    <House x={780} y={1460} s={0.8} t={t + 1} smoke color="#9fc6e6" />
    <g transform={`translate(540 760) scale(${pop(t, 0.5)})`}>
      <path d="M -40 -110 L 40 -110 L -10 0 L 50 0 L -40 140 L -10 30 L -60 30 Z" fill={C.yellow} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    </g>
  </>
);

const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <Sky top="#7cd0f7" bottom="#cdeffd" y1={1300} />
    <Sun x={800} y={560} r={110} t={t} scale={pop(t, 0.1)} />
    <Hills />
    <Bolo t={t} x={540} y={1740} s={1.2} expression="happy" pose="armsUp" />
  </>
);

export const scenes: SceneMap = { hook: Hook, crops: Crops, bears: Bears, snow: SnowDays, heat: Heat, outro: Outro };
