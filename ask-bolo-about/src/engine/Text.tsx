import React from "react";
import { C, FONT } from "./theme";

/** Chunky outlined text like the reference captions: dark stroke + drop shadow under a solid fill. */
export const Outlined: React.FC<{
  children: string;
  size: number;
  color?: string;
  stroke?: number;
  strokeColor?: string;
  shadow?: number;
  style?: React.CSSProperties;
}> = ({ children, size, color = C.white, stroke, strokeColor = C.ink, shadow, style }) => {
  const sw = stroke ?? Math.round(size * 0.2);
  const sh = shadow ?? Math.round(size * 0.07);
  const base: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: size,
    lineHeight: 1,
    textTransform: "uppercase",
    whiteSpace: "pre",
    letterSpacing: size * 0.01,
  };
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span
        aria-hidden
        style={{
          ...base,
          position: "absolute",
          left: 0,
          top: 0,
          color: strokeColor,
          WebkitTextStroke: `${sw}px ${strokeColor}`,
          filter: `drop-shadow(0 ${sh}px 0 rgba(20,10,5,0.75))`,
        }}
      >
        {children}
      </span>
      <span style={{ ...base, position: "relative", color }}>{children}</span>
    </span>
  );
};
