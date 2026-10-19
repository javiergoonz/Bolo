import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { fadeIn, tween } from "./anim";
import { buildChunks, Captions } from "./Captions";
import { Label, Title } from "./Overlays";
import { H, W } from "./theme";
import type { SceneMap, SceneTiming, Script, Timings } from "./types";

const FADE = 0.3;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");

const SceneShell: React.FC<{
  index: number;
  scene: SceneTiming;
  script: Script;
  Comp: React.FC<{ t: number; dur: number; at: (w: string, nth?: number) => number }>;
}> = ({ index, scene, script, Comp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const dur = scene.end - scene.start;
  const at = (word: string, nth = 0) => {
    const hits = scene.words.filter((w) => norm(w.text) === norm(word));
    const w = hits[Math.min(nth, hits.length - 1)];
    return w ? w.start - scene.start : 0;
  };
  const info = script.scenes[index];
  const isHook = index === 0;
  const isOutro = index === script.scenes.length - 1;
  return (
    <AbsoluteFill
      style={{
        opacity: isHook ? 1 : fadeIn(t, 0, FADE),
        scale: String(isHook ? 1 : tween(t, 0, 0.6, 1.035, 1)),
        overflow: "hidden",
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Comp t={t} dur={dur} at={at} />
      </svg>
      {isHook ? <Title t={t} top={script.title.top} pill={script.title.pill} /> : null}
      {info.label && !isHook ? (
        <Label t={t - (scene.labelAt - scene.start)} text={info.label.text} kind={info.label.style} big={isOutro} />
      ) : null}
    </AbsoluteFill>
  );
};

export const WhatIfVideo: React.FC<{ script: Script; timings: Timings; scenes: SceneMap }> = ({ script, timings, scenes }) => {
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(timings, ["hook"]), [timings]);
  const last = timings.scenes.length - 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timings.scenes.map((sc, i) => {
        const from = Math.round(sc.start * fps);
        const to = Math.round(sc.end * fps) + (i < last ? Math.round(FADE * fps) : 0);
        const Comp = scenes[sc.id];
        if (!Comp) throw new Error(`Missing scene component "${sc.id}" for ${script.id}`);
        return (
          <Sequence key={sc.id} from={from} durationInFrames={to - from} layout="absolute-fill" name={sc.id}>
            <SceneShell index={i} scene={sc} script={script} Comp={Comp} />
          </Sequence>
        );
      })}
      <Captions chunks={chunks} />
      <Audio src={staticFile(`audio/${script.id}.mp3`)} />
    </AbsoluteFill>
  );
};
