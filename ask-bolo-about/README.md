# Ask Bolo About — vídeos "What if…?"

Shorts verticales (1080×1920, 30 fps, 30–45 s) con el estilo del canal: Bolo, el
personaje naranja; fondos planos de dibujo animado; título con píldora; etiquetas
que aparecen de golpe en cada escena; subtítulos tipo karaoke con la palabra
activa en amarillo; voz en off; música de fondo; y cierre con
*"So, thank you, …! Subscribe for more what-ifs."*

| # | Composición | Tema |
|---|---|---|
| 1 | `WhatIfSun` | What if the Sun suddenly disappeared? |
| 2 | `WhatIfEarthStoppedSpinning` | What if Earth stopped spinning? |
| 3 | `WhatIfBeesDisappeared` | What if all the bees disappeared? |
| 4 | `WhatIfTreesDisappeared` | What if all the trees disappeared? |
| 5 | `WhatIfEarthHadRings` | What if Earth had rings like Saturn? |
| 6 | `WhatIfIceMelted` | What if all the ice melted? |
| 7 | `WhatIfOceansDriedUp` | What if the oceans dried up? |
| 8 | `WhatIfDinosaursSurvived` | What if dinosaurs never went extinct? |
| 9 | `WhatIfNoFriction` | What if friction disappeared? |
| 10 | `WhatIfEarthTwiceAsBig` | What if Earth was twice as big? |

## Estructura

- `videos/`: los 10 MP4 terminados.
- `src/videos/scripts.json`: guiones (texto narrado por escena, título y etiquetas).
- `src/videos/<id>.tsx`: las escenas animadas de cada vídeo.
- `src/videos/timings/<id>.json`: tiempos por palabra (generados).
- `public/audio/<id>.mp3`: banda sonora final (generada).
- `src/bolo/Bolo.tsx`: el personaje, con expresiones y poses.
- `src/art/`: biblioteca de dibujos (cielos, la Tierra, animales, objetos).
- `src/engine/`: subtítulos, título, etiquetas y la secuencia de escenas.
- `tools/`: generación de audio, render y hojas de control.

## Comandos

```console
npm i
npm run dev                  # previsualizar en Remotion Studio
./tools/render_all.sh        # renderizar los 10 MP4 en videos/
```

## Cambiar un guion o la voz

La voz es Kokoro TTS (voz `am_michael`, tono parecido al del narrador original).
El audio y los tiempos se regeneran con:

```console
pip install kokoro-onnx soundfile scipy onnx
# modelo: https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
python3 tools/patch_kokoro.py kokoro-v1.0.onnx kokoro-dur.onnx
python3 tools/build_audio.py --model kokoro-dur.onnx --voices voices-v1.0.bin [ids...]
```

`patch_kokoro.py` añade al modelo una salida con la duración de cada fonema,
que se usa para saber cuándo se dice cada palabra (subtítulos y animaciones).
La música y los efectos se sintetizan en `build_audio.py`, sin muestras externas.
