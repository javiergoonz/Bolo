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

import { scenes as moon } from "./moon";
import moonT from "./timings/moon.json";
import { scenes as rain } from "./rain";
import rainT from "./timings/rain.json";
import { scenes as nonight } from "./nonight";
import nonightT from "./timings/nonight.json";
import { scenes as fly } from "./fly";
import flyT from "./timings/fly.json";
import { scenes as volcano } from "./volcano";
import volcanoT from "./timings/volcano.json";
import { scenes as mars } from "./mars";
import marsT from "./timings/mars.json";
import { scenes as noair } from "./noair";
import noairT from "./timings/noair.json";
import { scenes as winter } from "./winter";
import winterT from "./timings/winter.json";
import { scenes as halfg } from "./halfg";
import halfgT from "./timings/halfg.json";
import { scenes as fish } from "./fish";
import fishT from "./timings/fish.json";

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
  moon: { scenes: moon, timings: moonT },
  rain: { scenes: rain, timings: rainT },
  nonight: { scenes: nonight, timings: nonightT },
  fly: { scenes: fly, timings: flyT },
  volcano: { scenes: volcano, timings: volcanoT },
  mars: { scenes: mars, timings: marsT },
  noair: { scenes: noair, timings: noairT },
  winter: { scenes: winter, timings: winterT },
  halfg: { scenes: halfg, timings: halfgT },
  fish: { scenes: fish, timings: fishT },
};

export const VIDEOS = (scriptsJson.videos as Script[]).map((script) => ({ script, ...SCENES[script.id] }));
