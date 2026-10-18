// Cifras de los huecos de catálogo (Futbol Emotion, temporadas sueltas), para el
// antes/después de huecos_catalogo.sh:  npx tsx scripts/fixes/huecos_cifras.mts
import { products } from "../../src/data/products";
import { TEAM_LEAGUE } from "../../src/data/teamMeta";

const CALENDAR = new Set(["mls", "brasileirao", "liga-argentina", "j-league", "liga-colombia", "liga-chile", "liga-uruguay"]);
const fe = (p: (typeof products)[number]) => p.offers.some((o) => o.store === "Futbol Emotion");
const single = products.filter(
  (p) => /^\d{4}$/.test(p.season) && p.typeKey !== "retro" && TEAM_LEAGUE[p.teamKey] && !CALENDAR.has(TEAM_LEAGUE[p.teamKey]),
);
console.log(
  `  fichas ${products.length} | Futbol Emotion: ${products.flatMap((p) => p.offers).filter((o) => o.store === "Futbol Emotion").length} ofertas en ${products.filter(fe).length} fichas` +
    ` (niño ${products.filter((p) => p.ageGroup === "kids" && fe(p)).length}, mujer ${products.filter((p) => p.ageGroup === "women" && fe(p)).length})`,
);
console.log(`  fichas no retro con temporada de un solo año en ligas de temporada partida: ${single.length}`);
console.log(`  cremonese: ${products.filter((p) => p.teamKey === "cremonese").map((p) => p.id + "=" + p.season).join(", ")}`);
