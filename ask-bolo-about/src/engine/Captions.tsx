import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "./anim";
import { Outlined } from "./Text";
import { C } from "./theme";
import type { Timings, Word } from "./types";

type Chunk = { words: Word[]; start: number; end: number };

const MAX_WORDS = 3;
const MAX_CHARS = 15;

/** Split narration into the short 1-3 word groups the reference shows on screen. */
export const buildChunks = (timings: Timings, skipScenes: string[]): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const scene of timings.scenes) {
    if (skipScenes.includes(scene.id)) continue;
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    };
    for (const w of scene.words) {
      const chars = cur.reduce((n, x) => n + x.text.length, 0) + w.text.length;
      if (cur.length >= MAX_WORDS || (cur.length && chars > MAX_CHARS)) flush();
      cur.push(w);
      if (/[,.!?…:]$/.test(w.text)) flush();
    }
    flush();
  }
  // Keep each chunk up until the next one starts (short gaps only).
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    const hold = chunks[i].end + 0.45;
    chunks[i].end = next ? Math.min(next.start, Math.max(hold, chunks[i].end)) : hold;
  }
  return chunks;
};

export const Captions: React.FC<{ chunks: Chunk[]; y?: number }> = ({ chunks, y = 1330 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = chunks.find((c) => t >= c.start - 0.03 && t < c.end);
  if (!chunk) return null;
  const k = pop(t, chunk.start - 0.03, 0.22);
  const active = [...chunk.words].reverse().find((w) => t >= w.start - 0.03) ?? chunk.words[0];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: y,
          translate: "0 -50%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 22,
          rowGap: 4,
          scale: String(k),
          rotate: "-1.5deg",
        }}
      >
        {chunk.words.map((w, i) => (
          <Outlined key={i} size={94} color={w === active ? C.yellow : C.white}>
            {w.text}
          </Outlined>
        ))}
      </div>
    </AbsoluteFill>
  );
};
