import React from "react";
import { bob, pop } from "./anim";
import { Outlined } from "./Text";
import { C, FONT } from "./theme";
import type { LabelStyle } from "./types";

/** Hook title: white question on top, key words in a navy pill (as in the reference). */
export const Title: React.FC<{ t: number; top: string; pill: string }> = ({ t, top, pill }) => {
  const a = pop(t, 0.05, 0.4);
  const b = pop(t, 0.4, 0.4);
  const long = top.length > 20;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        translate: `0 ${bob(t, 5, 0.35)}px`,
      }}
    >
      <div style={{ scale: String(a), rotate: "-4deg", textAlign: "center", maxWidth: 940 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 22, rowGap: 6 }}>
          {top.split(" ").map((w, i) => (
            <Outlined key={i} size={long ? 92 : 100}>
              {w}
            </Outlined>
          ))}
        </div>
      </div>
      <div
        style={{
          scale: String(b),
          rotate: "-3deg",
          background: C.navy,
          border: `8px solid ${C.ink}`,
          borderRadius: 30,
          padding: "22px 36px 8px",
          boxShadow: `0 12px 0 ${C.ink}`,
        }}
      >
        <Outlined size={pill.length > 12 ? 92 : 104} color={C.yellow}>
          {pill}
        </Outlined>
      </div>
    </div>
  );
};

/** Section label that pops in at the top of each scene. */
export const Label: React.FC<{ t: number; text: string; kind: LabelStyle; big?: boolean }> = ({ t, text, kind, big }) => {
  const k = pop(t, 0, 0.42);
  const float = bob(t, 4, 0.3);
  if (kind === "yellow") {
    const size = big ? 118 : text.length > 16 ? 90 : 104;
    return (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: big ? 150 : 170,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 24,
          rowGap: 8,
          scale: String(k),
          rotate: "-3deg",
          translate: `0 ${float}px`,
        }}
      >
        {text.split(" ").map((w, i) => (
          <Outlined key={i} size={size} color={C.yellow}>
            {w}
          </Outlined>
        ))}
      </div>
    );
  }
  const red = kind === "red";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 185, display: "flex", justifyContent: "center", translate: `0 ${float}px` }}>
      <div
        style={{
          scale: String(k),
          rotate: "-3deg",
          background: red ? C.red : C.cream,
          color: red ? C.white : C.ink,
          border: `7px solid ${C.ink}`,
          borderRadius: red ? 26 : 20,
          padding: "18px 34px 6px",
          boxShadow: `10px 10px 0 ${C.ink}`,
          fontFamily: FONT,
          fontSize: text.length > 16 ? 66 : 76,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
