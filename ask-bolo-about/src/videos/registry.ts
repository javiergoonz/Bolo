import scriptsJson from "./scripts.json";
import type { SceneMap, Script, Timings } from "../engine/types";
import { scenes as bees } from "./bees";
import { scenes as bigearth } from "./bigearth";
import { scenes as dinos } from "./dinos";
import { scenes as friction } from "./friction";
import { scenes as ice } from "./ice";
import { scenes as oceans } from "./oceans";
import { scenes as rings } from "./rings";
import { scenes as spin } from "./spin";
import { scenes as sun } from "./sun";
import { scenes as trees } from "./trees";
import beesT from "./timings/bees.json";
import bigearthT from "./timings/bigearth.json";
import dinosT from "./timings/dinos.json";
import frictionT from "./timings/friction.json";
import iceT from "./timings/ice.json";
import oceansT from "./timings/oceans.json";
import ringsT from "./timings/rings.json";
import spinT from "./timings/spin.json";
import sunT from "./timings/sun.json";
import treesT from "./timings/trees.json";

const SCENES: Record<string, { scenes: SceneMap; timings: Timings }> = {
  sun: { scenes: sun, timings: sunT },
  spin: { scenes: spin, timings: spinT },
  bees: { scenes: bees, timings: beesT },
  trees: { scenes: trees, timings: treesT },
  rings: { scenes: rings, timings: ringsT },
  ice: { scenes: ice, timings: iceT },
  oceans: { scenes: oceans, timings: oceansT },
  dinos: { scenes: dinos, timings: dinosT },
  friction: { scenes: friction, timings: frictionT },
  bigearth: { scenes: bigearth, timings: bigearthT },
};

export const VIDEOS = (scriptsJson.videos as Script[]).map((script) => ({ script, ...SCENES[script.id] }));
