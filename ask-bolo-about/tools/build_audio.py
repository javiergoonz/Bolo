#!/usr/bin/env python3
"""Build the soundtrack and word timings for every "Ask Bolo About" video.

For each video in src/videos/scripts.json this writes:
  public/audio/<id>.mp3          voiceover + music bed + sound effects (48 kHz stereo)
  src/videos/timings/<id>.json   scene boundaries and per-word timings for captions

Voice: Kokoro TTS (kokoro-onnx). The model must expose phoneme durations so we
get exact word timings; tools/patch_kokoro.py adds that output to the stock model.

Usage:
  python3 tools/build_audio.py --model kokoro-dur.onnx --voices voices-v1.0.bin [ids...]
"""

import argparse
import json
import os
import re
import subprocess
from difflib import SequenceMatcher

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from scipy.signal import butter, resample_poly, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
PUNCT = set(" ;:,.!?¡¿—…\"«»“”()-")

LEAD_IN = 0.15
GAP_AFTER_HOOK = 0.45
GAP = 0.35
TAIL = 1.6


# ---------------------------------------------------------------- voice


def phoneme_words(spoken):
    """Group per-phoneme timings into words (split on spaces/punctuation)."""
    words, cur = [], []
    for t in spoken:
        if t.phoneme in PUNCT:
            if cur:
                words.append(cur)
                cur = []
        else:
            cur.append(t)
    if cur:
        words.append(cur)
    return words


def norm(ph):
    return "".join(c for c in ph if c not in PUNCT and c not in "ˈˌː")


MOVES = [(1, 1), (2, 1), (3, 1), (1, 2), (1, 3)]


def word_timings(k, text, spoken):
    """Align the text's words with the spoken phoneme words.

    espeak sometimes fuses short words ("of the" -> one phoneme word) or splits
    one (hyphens, numbers), so align with a small DP over phoneme similarity.
    """
    twords = [w for w in text.split() if re.search(r"[A-Za-z0-9]", w)]
    pwords = phoneme_words(spoken)
    ind = [norm(k.tokenizer.phonemize(w)) for w in twords]
    pstr = [norm("".join(t.phoneme for t in pw)) for pw in pwords]
    T, P = len(twords), len(pwords)
    INF = float("inf")
    dp = [[INF] * (P + 1) for _ in range(T + 1)]
    back = [[None] * (P + 1) for _ in range(T + 1)]
    dp[0][0] = 0.0
    for i in range(T + 1):
        for j in range(P + 1):
            if dp[i][j] == INF:
                continue
            for a, b in MOVES:
                if i + a > T or j + b > P:
                    continue
                ratio = SequenceMatcher(None, "".join(ind[i : i + a]), "".join(pstr[j : j + b])).ratio()
                c = dp[i][j] + (1 - ratio) + 0.15 * (a + b - 2)
                if c < dp[i + a][j + b]:
                    dp[i + a][j + b] = c
                    back[i + a][j + b] = (a, b)
    if dp[T][P] == INF:
        raise RuntimeError(f"could not align {text!r}")
    steps, i, j = [], T, P
    while i or j:
        a, b = back[i][j]
        steps.append((i - a, j - b, a, b))
        i, j = i - a, j - b
    out = []
    for i, j, a, b in reversed(steps):
        if a == 1:
            out.append({"text": twords[i], "start": pwords[j][0].start, "end": pwords[j + b - 1][-1].end})
            continue
        # Several text words fused into one phoneme word: cut by phoneme share.
        ph = pwords[j]
        lens = np.array([max(1, len(x)) for x in ind[i : i + a]], float)
        cuts = np.round(np.cumsum(lens) / lens.sum() * len(ph)).astype(int)
        prev = 0
        for n, cut in enumerate(cuts):
            cut = max(prev + 1, min(len(ph), cut)) if n < a - 1 else len(ph)
            seg = ph[prev:cut] or ph[-1:]
            out.append({"text": twords[i + n], "start": seg[0].start, "end": seg[-1].end})
            prev = cut
    return out


def synth(k, text, voice, speed):
    audio, sr, spoken = k.create_timed(
        text, voice=voice, speed=speed, sentence_pause=0.3, clause_pause=0.12
    )
    words = word_timings(k, text, spoken)
    audio = resample_poly(audio, SR, sr).astype(np.float32)
    return audio, words


# ---------------------------------------------------------------- music


def midi_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_exp(n, decay):
    t = np.arange(n) / SR
    return np.exp(-t * decay)


def pluck(freq, dur=1.2, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for h in range(1, 9):
        y += (1 / h**1.3) * np.sin(2 * np.pi * h * freq * t) * np.exp(-t * (2.5 + 2.2 * h * bright))
    att = np.minimum(1, t / 0.004)
    return (y * att).astype(np.float32)


def bell(freq, dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * t) * np.exp(-t * 3.2)
    y += 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 7)
    y += 0.12 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 14)
    return (y * np.minimum(1, t / 0.002)).astype(np.float32)


def bass(freq, dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * 2 * freq * t)
    e = np.minimum(1, t / 0.01) * np.exp(-t * 4)
    return (y * e).astype(np.float32)


_rng = np.random.default_rng(7)
_HP = butter(4, 6000, "highpass", fs=SR, output="sos")
_BP = butter(2, [900, 3500], "bandpass", fs=SR, output="sos")


def shaker(dur=0.07):
    n = int(dur * SR)
    y = sosfilt(_HP, _rng.standard_normal(n))
    return (y * env_exp(n, 60)).astype(np.float32)


def snap(dur=0.15):
    n = int(dur * SR)
    y = sosfilt(_BP, _rng.standard_normal(n))
    return (y * env_exp(n, 30)).astype(np.float32)


def kick(dur=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 120 * np.exp(-t * 18) + 45
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 14)).astype(np.float32)


def add(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


def music(duration, transpose=0, seed=1, bpm=108):
    """Cheerful ukulele-ish loop: I-V-vi-IV plucks, bass, bells, light percussion."""
    rng = np.random.default_rng(seed)
    beat = 60 / bpm
    bar = 4 * beat
    out = np.zeros(int((duration + 2) * SR), np.float32)
    base = 60 + transpose  # C4
    prog = [(0, [0, 4, 7, 12]), (7, [-1, 2, 7, 11]), (9, [0, 4, 9, 12]), (5, [0, 5, 9, 12])]
    strum = [(0, 1.0), (1, 0.6), (1.5, 0.7), (2.5, 0.6), (3, 0.8), (3.5, 0.5)]
    penta = [0, 2, 4, 7, 9, 12, 14, 16]
    cache = {}

    def note(kind, m):
        key = (kind, m)
        if key not in cache:
            cache[key] = {"pluck": pluck, "bell": bell, "bass": bass}[kind](midi_hz(m))
        return cache[key]

    nbars = int(duration / bar) + 2
    for b in range(nbars):
        t0 = b * bar
        root, chord = prog[b % 4]
        for pos, vel in strum:
            for i, iv in enumerate(chord):
                add(out, note("pluck", base + iv), t0 + pos * beat + i * 0.012, 0.11 * vel)
        for pos in (0, 2, 3.5):
            add(out, note("bass", base - 24 + root), t0 + pos * beat, 0.32)
        for pos in (0, 2):
            add(out, kick(), t0 + pos * beat, 0.35)
        for pos in (1, 3):
            add(out, snap(), t0 + pos * beat, 0.08)
        for e in range(8):
            add(out, shaker(), t0 + e * beat / 2, 0.05 if e % 2 else 0.025)
        if b % 2 == 1:
            for e in range(8):
                if rng.random() < 0.55:
                    add(out, note("bell", base + 12 + rng.choice(penta)), t0 + e * beat / 2, 0.07)
    out = out[: int(duration * SR)]
    n = len(out)
    fade_in = np.minimum(1, np.arange(n) / (0.3 * SR))
    fade_out = np.clip((n - np.arange(n)) / (1.5 * SR), 0, 1)
    return out * fade_in * fade_out


# ---------------------------------------------------------------- sfx


def sfx_pop():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    f = 520 + 900 * (t / t[-1])
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 45) * np.minimum(1, t / 0.002)).astype(np.float32)


def sfx_whoosh():
    n = int(0.38 * SR)
    t = np.arange(n) / SR
    noise = _rng.standard_normal(n)
    out = np.zeros(n)
    seg = n // 8
    for i in range(8):
        lo = 600 + 350 * i
        sos = butter(2, [lo, lo * 2.2], "bandpass", fs=SR, output="sos")
        out[i * seg : (i + 1) * seg] = sosfilt(sos, noise)[i * seg : (i + 1) * seg]
    env = np.sin(np.pi * t / t[-1]) ** 2
    return (out * env).astype(np.float32)


# ---------------------------------------------------------------- build


def build_video(k, v, voice, speed, transpose, seed):
    print(f"[{v['id']}]")
    voice_buf = []
    cursor = LEAD_IN
    scenes = []
    for i, sc in enumerate(v["scenes"]):
        audio, words = synth(k, sc["text"], voice, speed)
        start = cursor
        for w in words:
            w["start"] = round(w["start"] + start, 3)
            w["end"] = round(w["end"] + start, 3)
        voice_buf.append((start, audio))
        end = start + len(audio) / SR
        scenes.append({"id": sc["id"], "audioStart": round(start, 3), "audioEnd": round(end, 3), "words": words})
        cursor = end + (GAP_AFTER_HOOK if i == 0 else GAP)
    duration = scenes[-1]["audioEnd"] + TAIL

    # Visual scene boundaries: cut a little before each scene's first word.
    for i, sc in enumerate(scenes):
        if i == 0:
            sc["start"] = 0.0
        else:
            sc["start"] = round(max(scenes[i - 1]["audioEnd"] + 0.05, sc["audioStart"] - 0.2), 3)
    for i, sc in enumerate(scenes):
        sc["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else round(duration, 3)
        sc["labelAt"] = round(sc["start"] + 0.15, 3)

    n = int(duration * SR)
    vo = np.zeros(n, np.float32)
    for start, audio in voice_buf:
        add(vo, audio, start)
    vo *= 0.89 / (np.abs(vo).max() + 1e-9)

    mus = music(duration, transpose=transpose, seed=seed)
    mus *= 0.16 / (np.abs(mus).max() + 1e-9)

    fx = np.zeros(n, np.float32)
    pop, whoosh = sfx_pop(), sfx_whoosh()
    add(fx, pop, 0.12, 0.3)
    add(fx, pop, 0.5, 0.3)
    for i, sc in enumerate(scenes):
        if i > 0:
            add(fx, whoosh, max(0, sc["start"] - 0.12), 0.1)
        if "label" in v["scenes"][i]:
            add(fx, pop, sc["labelAt"] + 0.05, 0.26)

    mix = vo + mus + fx
    peak = np.abs(mix).max()
    if peak > 0.98:
        mix *= 0.98 / peak
    stereo = np.stack([mix, mix], axis=1)
    os.makedirs(os.path.join(ROOT, "public", "audio"), exist_ok=True)
    wav = os.path.join(ROOT, "public", "audio", f"{v['id']}.wav")
    sf.write(wav, stereo, SR, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "192k", wav[:-4] + ".mp3"], check=True)
    os.remove(wav)

    os.makedirs(os.path.join(ROOT, "src", "videos", "timings"), exist_ok=True)
    with open(os.path.join(ROOT, "src", "videos", "timings", f"{v['id']}.json"), "w") as f:
        json.dump({"id": v["id"], "duration": round(duration, 3), "scenes": scenes}, f, indent=1)
    print(f"  duration {duration:.1f}s, {sum(len(s['words']) for s in scenes)} words")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--voices", required=True)
    ap.add_argument("ids", nargs="*")
    args = ap.parse_args()
    with open(os.path.join(ROOT, "src", "videos", "scripts.json")) as f:
        data = json.load(f)
    k = Kokoro(args.model, args.voices)
    if not k.has_timings:
        raise SystemExit("Model has no duration output; run tools/patch_kokoro.py first")
    for i, v in enumerate(data["videos"]):
        if args.ids and v["id"] not in args.ids:
            continue
        build_video(k, v, data["voice"], data["speed"], transpose=[0, 2, -3, 5, -1, 3, -2, 4, 1, -4][i % 10], seed=i + 1)


if __name__ == "__main__":
    main()
