import React from "react";
import { Composition } from "remotion";
import { WhatIfVideo } from "./engine/WhatIfVideo";
import { FPS, H, W } from "./engine/theme";
import { VIDEOS } from "./videos/registry";

// Scene components can't travel through (JSON-serialized) input props,
// so each video gets its own wrapper component.
const COMPONENTS = VIDEOS.map((v) => {
  const C: React.FC = () => <WhatIfVideo script={v.script} timings={v.timings} scenes={v.scenes} />;
  C.displayName = v.script.comp;
  return C;
});

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v, i) => (
      <Composition
        key={v.script.id}
        id={v.script.comp}
        component={COMPONENTS[i]}
        durationInFrames={Math.ceil(v.timings.duration * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
