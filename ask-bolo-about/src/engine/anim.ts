import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolation over seconds with an ease-out by default. */
export const tween = (
  t: number,
  t0: number,
  t1: number,
  from: number,
  to: number,
  easing: (n: number) => number = Easing.bezier(0.33, 1, 0.68, 1),
) => interpolate(t, [t0, t1], [from, to], { ...clamp, easing });

export const linear = (t: number, t0: number, t1: number, from: number, to: number) =>
  interpolate(t, [t0, t1], [from, to], clamp);

/** Overshooting pop from 0 to 1, starting at t0 (seconds). */
export const pop = (t: number, t0: number, dur = 0.38) => {
  if (t <= t0) return 0;
  return interpolate(t, [t0, t0 + dur * 0.6, t0 + dur * 0.82, t0 + dur], [0.15, 1.1, 0.97, 1], {
    ...clamp,
    easing: Easing.bezier(0.3, 0.9, 0.4, 1),
  });
};

export const fadeIn = (t: number, t0: number, dur = 0.25) => linear(t, t0, t0 + dur, 0, 1);
export const fadeOut = (t: number, t0: number, dur = 0.25) => linear(t, t0, t0 + dur, 1, 0);

/** Gentle periodic float. */
export const bob = (t: number, amp = 8, speed = 1, phase = 0) =>
  Math.sin((t * speed + phase) * Math.PI * 2) * amp;

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const tr = (x: number, y: number, s = 1, r = 0) =>
  `translate(${x} ${y}) rotate(${r}) scale(${s})`;
