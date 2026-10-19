import type React from "react";

export type Word = { text: string; start: number; end: number };

export type SceneTiming = {
  id: string;
  start: number;
  end: number;
  audioStart: number;
  audioEnd: number;
  labelAt: number;
  words: Word[];
};

export type Timings = { id: string; duration: number; scenes: SceneTiming[] };

export type LabelStyle = "card" | "red" | "yellow";

export type ScriptScene = { id: string; text: string; label?: { text: string; style: LabelStyle } };

export type Script = {
  id: string;
  comp: string;
  title: { top: string; pill: string };
  scenes: ScriptScene[];
};

export type SceneProps = {
  /** Seconds since the scene started. */
  t: number;
  /** Scene length in seconds. */
  dur: number;
  /** Scene-relative time when a word is spoken (first match, case-insensitive, punctuation ignored). */
  at: (word: string, nth?: number) => number;
};

export type SceneMap = Record<string, React.FC<SceneProps>>;
