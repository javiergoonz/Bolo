import React from "react";
import { C } from "../engine/theme";
import { tr } from "../engine/anim";

export type Expression =
  | "shocked"
  | "amazed"
  | "happy"
  | "smile"
  | "grit"
  | "hot"
  | "cold"
  | "sad"
  | "worried"
  | "tired";

export type Pose = "idle" | "cheeks" | "armsUp" | "flashlight" | "shrug" | "point" | "reach" | "hold" | "run";

type Props = {
  t: number; // seconds, drives idle motion and blinking
  x: number;
  y: number; // ground point under the feet
  s?: number;
  expression?: Expression;
  pose?: Pose;
  look?: [number, number]; // pupil direction, -1..1
  flip?: boolean;
  lift?: number; // jump height in px (before scale)
  squash?: number; // 1 = normal, <1 squashed
  shiver?: boolean;
  item?: React.ReactNode; // drawn at the right hand
  opacity?: number;
  tilt?: number; // degrees
};

const OUT = C.ink;
const BODY_Y = -258;

const Limb: React.FC<{ d: string; color: string }> = ({ d, color }) => (
  <>
    <path d={d} fill="none" stroke={OUT} strokeWidth={23} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const Hand: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <circle cx={x} cy={y} r={16} fill={color} stroke={OUT} strokeWidth={5.5} />
);

const Shoe: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} -16) scale(${flip ? -1 : 1} 1)`}>
    <path
      d="M -30 12 C -34 -10, -14 -20, 4 -18 C 24 -16, 40 -6, 40 8 C 40 16, 30 18, 0 18 C -24 18, -30 18, -30 12 Z"
      fill={C.shoe}
      stroke={OUT}
      strokeWidth={5}
    />
    <path d="M -30 9 L 40 9" stroke={C.shoeStripe} strokeWidth={6} />
    <path d="M -30 12 C -30 18, -24 18, 0 18 C 30 18, 40 16, 40 8" fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);

// Arm paths from shoulders (±100, -250) per pose. Returns [left, right] path and hand positions.
const arms = (pose: Pose, t: number): { l: [string, number, number]; r: [string, number, number] } => {
  const w = Math.sin(t * 2 * Math.PI * 1.2) * 6;
  switch (pose) {
    case "cheeks":
      return {
        l: ["M -98 -232 Q -150 -200 -112 -238", -112, -238],
        r: ["M 98 -232 Q 150 -200 112 -238", 112, -238],
      };
    case "armsUp":
      return {
        l: [`M -95 -282 Q -140 -330 ${-150 + w} -430`, -150 + w, -430],
        r: [`M 95 -282 Q 140 -330 ${150 - w} -430`, 150 - w, -430],
      };
    case "flashlight":
      return {
        l: ["M -100 -232 Q -140 -200 -150 -158", -150, -158],
        r: ["M 100 -232 Q 140 -215 158 -212", 158, -212],
      };
    case "shrug":
      return {
        l: ["M -100 -230 Q -165 -205 -182 -282", -182, -282],
        r: ["M 100 -230 Q 165 -205 182 -282", 182, -282],
      };
    case "point":
      return {
        l: ["M -100 -232 Q -140 -200 -150 -158", -150, -158],
        r: [`M 98 -270 Q 150 -320 ${178 + w * 0.4} -392`, 178 + w * 0.4, -392],
      };
    case "reach":
      return {
        l: ["M -100 -232 Q -140 -200 -150 -158", -150, -158],
        r: ["M 100 -245 Q 160 -250 205 -250", 205, -250],
      };
    case "hold":
      return {
        l: ["M -100 -232 Q -150 -190 -112 -168", -112, -168],
        r: ["M 100 -232 Q 150 -190 112 -168", 112, -168],
      };
    case "run": {
      const a = Math.sin(t * 2 * Math.PI * 3.2) * 40;
      return {
        l: [`M -100 -240 Q -150 ${-210 - a * 0.5} ${-160} ${-180 - a}`, -160, -180 - a],
        r: [`M 100 -240 Q 150 ${-210 + a * 0.5} ${160} ${-180 + a}`, 160, -180 + a],
      };
    }
    default:
      return {
        l: ["M -100 -232 Q -142 -205 -150 -158", -150, -158],
        r: ["M 100 -232 Q 142 -205 150 -158", 150, -158],
      };
  }
};

const Mouth: React.FC<{ e: Expression; t: number }> = ({ e, t }) => {
  switch (e) {
    case "shocked":
      return (
        <g>
          <ellipse cx={0} cy={-200} rx={19} ry={26} fill="#5c1414" stroke={OUT} strokeWidth={5} />
          <ellipse cx={0} cy={-185} rx={11} ry={7} fill="#e0575b" />
        </g>
      );
    case "amazed":
      return <ellipse cx={0} cy={-202} rx={13} ry={15} fill="#5c1414" stroke={OUT} strokeWidth={5} />;
    case "grit":
    case "cold": {
      const j = e === "cold" ? Math.sin(t * 60) * 2 : 0;
      return (
        <g transform={`translate(0 ${j})`}>
          <rect x={-44} y={-226} width={88} height={38} rx={12} fill="#fff" stroke={OUT} strokeWidth={5} />
          <path d="M -44 -207 L 44 -207 M -22 -226 L -22 -188 M 0 -226 L 0 -188 M 22 -226 L 22 -188" stroke={OUT} strokeWidth={3.5} />
        </g>
      );
    }
    case "happy":
      return (
        <g>
          <path d="M -44 -224 Q 0 -218 44 -224 Q 40 -168 0 -166 Q -40 -168 -44 -224 Z" fill="#5c1414" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -22 -178 Q 0 -196 22 -178 Q 12 -168 0 -167 Q -12 -168 -22 -178 Z" fill="#e0575b" />
        </g>
      );
    case "hot":
      return (
        <g>
          <path d="M -36 -222 Q 0 -216 36 -222 Q 32 -186 0 -184 Q -32 -186 -36 -222 Z" fill="#5c1414" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -16 -196 Q -18 -160 0 -158 Q 18 -160 16 -196 Z" fill="#ef6a6e" stroke={OUT} strokeWidth={5} />
          <path d="M 0 -190 L 0 -168" stroke="#c94a50" strokeWidth={3} />
        </g>
      );
    case "sad":
      return <path d="M -30 -192 Q 0 -222 30 -192" fill="none" stroke={OUT} strokeWidth={7} strokeLinecap="round" />;
    case "worried":
      return (
        <path d="M -34 -200 q 11 -12 22 0 q 11 12 22 0 q 11 -12 22 0" fill="none" stroke={OUT} strokeWidth={6.5} strokeLinecap="round" />
      );
    case "tired":
      return <path d="M -24 -200 L 24 -200" stroke={OUT} strokeWidth={7} strokeLinecap="round" />;
    default:
      return <path d="M -34 -214 Q 0 -180 34 -214" fill="none" stroke={OUT} strokeWidth={7} strokeLinecap="round" />;
  }
};

const Eye: React.FC<{ x: number; open: number; look: [number, number]; e: Expression }> = ({ x, open, look, e }) => {
  const big = e === "shocked" || e === "amazed";
  const r = big ? 40 : 36;
  const pr = big ? 12 : 15;
  const cy = -282;
  if (open < 0.18) {
    return <path d={`M ${x - r * 0.8} ${cy} Q ${x} ${cy + 10} ${x + r * 0.8} ${cy}`} stroke={OUT} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
  const px = x + look[0] * (r - pr - 6);
  const py = cy + look[1] * (r - pr - 6);
  return (
    <g transform={`translate(0 ${cy}) scale(1 ${open}) translate(0 ${-cy})`}>
      <circle cx={x} cy={cy} r={r} fill="#fff" stroke={OUT} strokeWidth={5.5} />
      <circle cx={px} cy={py} r={pr} fill="#111" />
      <circle cx={px - pr * 0.35} cy={py - pr * 0.4} r={pr * 0.32} fill="#fff" />
      {e === "tired" ? (
        <path d={`M ${x - r - 3} ${cy + 2} A ${r + 3} ${r + 3} 0 0 1 ${x + r + 3} ${cy + 2} Z`} fill={C.orange} stroke={OUT} strokeWidth={5} />
      ) : null}
    </g>
  );
};

export const Bolo: React.FC<Props> = ({
  t,
  x,
  y,
  s = 1,
  expression = "smile",
  pose = "idle",
  look = [0, 0],
  flip,
  lift = 0,
  squash = 1,
  shiver,
  item,
  opacity = 1,
  tilt = 0,
}) => {
  const breathe = 1 + Math.sin(t * Math.PI * 1.6) * 0.012;
  const sway = Math.sin(t * Math.PI * 0.9) * 1.2 + tilt;
  const blinkPhase = (t + 0.7) % 3.4;
  const open = blinkPhase < 0.13 ? Math.abs(blinkPhase - 0.065) / 0.065 : 1;
  const jx = shiver ? Math.sin(t * 70) * 3 : 0;
  const pale = expression === "cold";
  const bodyTop = pale ? "#f3d9b0" : "#ffb54a";
  const bodyBot = pale ? "#d9b88a" : C.orangeDark;
  const limb = pale ? "#e9c897" : C.orange;
  const { l, r } = arms(pose, t);
  const runLeg = pose === "run" ? Math.sin(t * 2 * Math.PI * 3.2) * 18 : 0;
  const gid = `bolo-${Math.round(x)}-${Math.round(y)}`;

  return (
    <g transform={`${tr(x + jx, y, s)} scale(${flip ? -1 : 1} 1)`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={78 * (1 - Math.min(lift, 300) / 600)} ry={12} fill="rgba(0,0,0,0.28)" />
      <g transform={`translate(0 ${-lift}) rotate(${sway}) scale(${1 / Math.sqrt(squash)} ${breathe * squash})`}>
        <defs>
          <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={bodyTop} />
            <stop offset="1" stopColor={bodyBot} />
          </linearGradient>
          <clipPath id={`${gid}-c`}>
            <ellipse cx={0} cy={BODY_Y} rx={112} ry={130} />
          </clipPath>
        </defs>
        {/* legs */}
        <g>
          <path d={`M -38 -140 L ${-42 + runLeg} -26`} stroke={OUT} strokeWidth={23} strokeLinecap="round" />
          <path d={`M -38 -140 L ${-42 + runLeg} -26`} stroke={limb} strokeWidth={12} strokeLinecap="round" />
          <path d={`M 38 -140 L ${42 - runLeg} -26`} stroke={OUT} strokeWidth={23} strokeLinecap="round" />
          <path d={`M 38 -140 L ${42 - runLeg} -26`} stroke={limb} strokeWidth={12} strokeLinecap="round" />
        </g>
        <Shoe x={-48 + runLeg} flip />
        <Shoe x={48 - runLeg} />
        {/* hair */}
        <g fill="none" stroke={C.hair} strokeWidth={7} strokeLinecap="round">
          <path d="M -4 -384 C -6 -420, 14 -432, 20 -452" />
          <path d="M -18 -380 C -30 -404, -50 -400, -56 -424" />
          <path d="M 14 -380 C 34 -398, 52 -392, 60 -414" />
        </g>
        {/* body */}
        <ellipse cx={0} cy={BODY_Y} rx={112} ry={130} fill={`url(#${gid}-g)`} />
        <g clipPath={`url(#${gid}-c)`}>
          <ellipse cx={0} cy={BODY_Y + 120} rx={150} ry={80} fill={bodyBot} opacity={0.55} />
          <ellipse cx={-48} cy={BODY_Y - 70} rx={34} ry={18} fill="#fff" opacity={0.18} transform={`rotate(-30 -48 ${BODY_Y - 70})`} />
        </g>
        <ellipse cx={0} cy={BODY_Y} rx={112} ry={130} fill="none" stroke={OUT} strokeWidth={6.5} />
        {/* cheeks */}
        <ellipse cx={-80} cy={-228} rx={18} ry={11} fill={pale ? "#9fc6f0" : C.cheek} opacity={0.85} />
        <ellipse cx={80} cy={-228} rx={18} ry={11} fill={pale ? "#9fc6f0" : C.cheek} opacity={0.85} />
        {/* eyes */}
        <Eye x={-42} open={open} look={look} e={expression} />
        <Eye x={42} open={open} look={look} e={expression} />
        {expression === "sad" || expression === "worried" ? (
          <g stroke={OUT} strokeWidth={6} strokeLinecap="round">
            <path d="M -70 -334 L -22 -324" />
            <path d="M 70 -334 L 22 -324" />
          </g>
        ) : null}
        <Mouth e={expression} t={t} />
        {expression === "hot" ? (
          <path d="M 92 -340 Q 104 -318 98 -306 Q 88 -300 82 -312 Q 82 -324 92 -340 Z" fill="#7fd0ff" stroke={OUT} strokeWidth={4} />
        ) : null}
        {/* arms */}
        <g>
          <Limb d={l[0]} color={limb} />
          <Limb d={r[0]} color={limb} />
          {pose === "flashlight" ? (
            <g transform={`translate(${r[1]} ${r[2]})`}>
              <path d="M 40 -10 L 330 -130 L 330 120 L 40 10 Z" fill="#fff6b0" opacity={0.28} />
              <rect x={-14} y={-12} width={50} height={24} rx={5} fill="#3b3b3b" stroke={OUT} strokeWidth={4} />
              <rect x={32} y={-16} width={14} height={32} rx={3} fill="#ffe14a" stroke={OUT} strokeWidth={4} />
            </g>
          ) : null}
          {item ? <g transform={`translate(${r[1]} ${r[2]})`}>{item}</g> : null}
          <Hand x={l[1]} y={l[2]} color={limb} />
          <Hand x={r[1]} y={r[2]} color={limb} />
        </g>
      </g>
    </g>
  );
};
