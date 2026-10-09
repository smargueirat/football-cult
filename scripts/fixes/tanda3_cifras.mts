// Cifras de la tanda 3 (catálogo), para el antes/después de tanda3_catalogo.sh:
//   npx tsx scripts/fixes/tanda3_cifras.mts
import { products } from "../../src/data/products";
import { bootProducts } from "../../src/data/boots";
import { gloveProducts } from "../../src/data/gloves";
import { ballProducts } from "../../src/data/balls";
import { apparelProducts } from "../../src/data/apparel";
import { trainingProducts } from "../../src/data/training";
import { gearName } from "../../src/lib/seoMeta";
import { TEAM_LEAGUE } from "../../src/data/teamMeta";

const current = (s: string) => /^(2025\/26|2026\/27|2026|2027)$/.test(s);
const fe = products.flatMap((p) => p.offers).filter((o) => o.store === "Futbol Emotion");
const soldOut = products.filter((p) => p.offers.length && !p.offers.some((o) => o.inStock));
const inLeague = (lg: string[]) => {
  const clubs = Object.keys(TEAM_LEAGUE).filter((k) => lg.includes(TEAM_LEAGUE[k]));
  const withCur = clubs.filter((k) => products.some((p) => p.teamKey === k && current(p.season) && p.offers.some((o) => o.inStock)));
  return `${withCur.length}/${clubs.length}`;
};
console.log(
  `  camisetas: ${products.length} fichas | Futbol Emotion: ${fe.length} ofertas en ${products.filter((p) => p.offers.some((o) => o.store === "Futbol Emotion")).length} fichas` +
    ` (niño ${products.filter((p) => p.ageGroup === "kids" && p.offers.some((o) => o.store === "Futbol Emotion")).length}, mujer ${products.filter((p) => p.ageGroup === "women" && p.offers.some((o) => o.store === "Futbol Emotion")).length})`,
);
for (const t of ["alaves", "cremonese", "huesca", "realzaragoza", "lorient", "brest"])
  console.log(`    ${t}: ${products.filter((p) => p.teamKey === t && current(p.season)).length} fichas de temporada`);
console.log(
  `  clubes con ficha de temporada en stock: 5 grandes ${inLeague(["laliga", "premier-league", "serie-a", "bundesliga", "ligue-1"])}, segundas ${inLeague(["segunda-espana", "efl", "serie-b", "2-bundesliga", "ligue-2"])}`,
);
console.log(`  camisetas con TODAS las ofertas agotadas: ${soldOut.length}`);
console.log(
  `  botas: ${bootProducts.length} fichas | Forum Sport: ${bootProducts.filter((b) => b.offers.some((o) => o.store === "ForumSport")).length} fichas, niño ${bootProducts.filter((b) => b.ageGroup === "kids").length}, sala ${bootProducts.filter((b) => b.groundType === "IC").length}`,
);
const S = { botas: bootProducts, guantes: gloveProducts, pelotas: ballProducts, ropa: apparelProducts, entrenamiento: trainingProducts } as const;
let byStore = 0;
for (const [sec, items] of Object.entries(S))
  for (const i of items) if (/ · [^·]+$/.test(gearName(sec as keyof typeof S, i as never, "es"))) byStore++;
console.log(
  `  equipamiento: ${gloveProducts.length + ballProducts.length + apparelProducts.length + trainingProducts.length} fichas | títulos que solo se distinguen por la tienda: ${byStore}`,
);
