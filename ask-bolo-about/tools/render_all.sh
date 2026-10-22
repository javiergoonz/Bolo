#!/usr/bin/env bash
# Render every video to videos/NN-<slug>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p videos
i=0
while read -r comp slug; do
  i=$((i + 1))
  name=$(printf "%02d-%s.mp4" "$i" "$slug")
  echo "== $comp -> videos/$name"
  if [ -n "${ONLY_MISSING:-}" ] && [ -f "videos/$name" ]; then continue; fi
  npx remotion render "$comp" "videos/$name" --log=error --concurrency=4
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
WhatIfMoonTwiceAsClose what-if-the-moon-was-twice-as-close
WhatIfRainNeverStopped what-if-it-never-stopped-raining
WhatIfNoNight what-if-night-never-came
WhatIfHumansCouldFly what-if-humans-could-fly
WhatIfVolcanoesErupted what-if-every-volcano-erupted
WhatIfWeLivedOnMars what-if-we-lived-on-mars
WhatIfNoAtmosphere what-if-earth-lost-its-atmosphere
WhatIfAlwaysWinter what-if-it-was-always-winter
WhatIfHalfGravity what-if-gravity-was-half-as-strong
WhatIfFishDisappeared what-if-all-the-fish-disappeared
LIST
