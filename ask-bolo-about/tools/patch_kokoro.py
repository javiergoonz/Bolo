#!/usr/bin/env python3
"""Expose Kokoro's per-phoneme durations as a "duration" output so kokoro-onnx
can report word timings (create_timed). Works on kokoro-v1.0.onnx from
https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0).

Usage: python3 tools/patch_kokoro.py kokoro-v1.0.onnx kokoro-dur.onnx
"""

import sys

import onnx
from onnx import TensorProto, helper

src, dst = sys.argv[1], sys.argv[2]
model = onnx.load(src)
graph = model.graph
# /encoder/Clip_output_0 holds the rounded, clamped predicted duration per token.
graph.node.append(
    helper.make_node("Cast", ["/encoder/Clip_output_0"], ["duration"], name="duration_out", to=TensorProto.INT64)
)
graph.output.append(helper.make_tensor_value_info("duration", TensorProto.INT64, None))
onnx.save(model, dst)
print(f"wrote {dst}")
