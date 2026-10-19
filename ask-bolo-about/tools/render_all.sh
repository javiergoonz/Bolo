#!/usr/bin/env bash
# Render every video to out/NN-<slug>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
i=0
while read -r comp slug; do
  i=$((i + 1))
  name=$(printf "%02d-%s.mp4" "$i" "$slug")
  echo "== $comp -> out/$name"
  npx remotion render "$comp" "out/$name" --log=error --concurrency=4
done <<'LIST'
WhatIfSun what-if-the-sun-disappeared
WhatIfEarthStoppedSpinning what-if-earth-stopped-spinning
WhatIfBeesDisappeared what-if-all-the-bees-disappeared
WhatIfTreesDisappeared what-if-all-the-trees-disappeared
WhatIfEarthHadRings what-if-earth-had-rings
WhatIfIceMelted what-if-all-the-ice-melted
WhatIfOceansDriedUp what-if-the-oceans-dried-up
WhatIfDinosaursSurvived what-if-dinosaurs-never-went-extinct
WhatIfNoFriction what-if-friction-disappeared
WhatIfEarthTwiceAsBig what-if-earth-was-twice-as-big
LIST
