#!/usr/bin/env python3
"""Render one still per scene (60% into it) for a video and tile them into a contact sheet.

Usage: python3 tools/qa_frames.py <video-id> <out-dir>
"""
import json, os, subprocess, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vid, out = sys.argv[1], sys.argv[2]
scripts = json.load(open(os.path.join(ROOT, "src/videos/scripts.json")))
comp = next(v["comp"] for v in scripts["videos"] if v["id"] == vid)
tm = json.load(open(os.path.join(ROOT, f"src/videos/timings/{vid}.json")))
frames = [int((s["start"] + (s["end"] - s["start"]) * 0.6) * 30) for s in tm["scenes"]]
d = os.path.join(out, vid)
os.makedirs(d, exist_ok=True)
for f in glob.glob(os.path.join(d, "*.jpeg")):
    os.remove(f)
subprocess.run(["npx", "remotion", "render", comp, d, f"--frames={','.join(map(str, frames))}", "--image-format=jpeg", "--log=error"], cwd=ROOT, check=True)
files = sorted(glob.glob(os.path.join(d, "*.jpeg")))
args = []
for f in files:
    args += ["-i", f]
n = len(files)
filt = "".join(f"[{i}]scale=360:-1[v{i}];" for i in range(n)) + "".join(f"[v{i}]" for i in range(n)) + f"hstack=inputs={n}"
subprocess.run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex", filt, os.path.join(out, f"{vid}_sheet.jpg")], check=True)
print(os.path.join(out, f"{vid}_sheet.jpg"))
