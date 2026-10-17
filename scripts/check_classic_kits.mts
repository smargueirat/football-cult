// Sección "Clásicas" (temporadas 2007-2019, 2026-10-17):
//   npx tsx scripts/check_classic_kits.mts          (exit 1 si algo falla)
//
// 1. Fronteras de isClassicKit / isVintageRetro (manda el primer año de la
//    temporada partida): 2006/07 retro, 2007/08 clásica, 2019/20 clásica,
//    2020/21 actual. Ninguna temporada es retro y clásica a la vez.
// 2. Hubs: título/intro con cifras reales en los 5 idiomas, 3+ camisetas, y
//    ninguna camiseta del hub es retro.
// 3. Fichas 2007-2019: miga a /clasicas (y a su hub de equipo si existe),
//    nunca "retro" en el título; "clásica/classic" cuando cabe con el código
//    en 60 caracteres (se informa cuántas lo llevan, no falla).
// 4. URLs nuevas y los equipos de las consultas de Search Console.
import { products } from "../src/data/products";
import { LOCALES } from "../src/lib/i18n/locales";
import { isClassicKit, isVintageRetro } from "../src/lib/productMeta";
import { classicHub, classicTeamDecadeFacets, classicTeamFacets, classicTeamItems, extraHubPaths, retroTeamItems } from "../src/lib/extraHubs";
import { jerseyRelated, jerseyTrail } from "../src/lib/detailLinks";
import { jerseyTitle } from "../src/lib/seoMeta";

const fails: string[] = [];
const fail = (m: string) => fails.length < 400 && fails.push(m);

// ---------- 1. fronteras
const CASES: [string, "retro" | "clasica" | "actual"][] = [
  ["1998/99", "retro"], ["2006", "retro"], ["2006/07", "retro"],
  ["2007", "clasica"], ["2007/08", "clasica"], ["2012/13", "clasica"], ["2019", "clasica"], ["2019/20", "clasica"],
  ["2020", "actual"], ["2020/21", "actual"], ["2025/26", "actual"],
];
for (const [season, want] of CASES) {
  const p = { season } as never;
  const got = isVintageRetro(p) ? (isClassicKit(p) ? "ambas" : "retro") : isClassicKit(p) ? "clasica" : "actual";
  if (got !== want) fail(`frontera ${season}: ${got}, se esperaba ${want}`);
}
const both = products.filter((p) => isVintageRetro(p) && isClassicKit(p));
if (both.length) fail(`${both.length} fichas retro y clásica a la vez`);

// ---------- 2. hubs
const teams = classicTeamFacets();
const teamDecades = classicTeamDecadeFacets();
const specs = [{}, ...teams.map((t) => ({ team: t.team })), ...teamDecades.map((d) => ({ team: d.team, decade: String(d.decade) }))];
let hubOk = 0;
for (const l of LOCALES) {
  for (const spec of specs) {
    const h = classicHub(spec, l);
    if (!h) { fail(`hub ${l} ${JSON.stringify(spec)} no existe`); continue; }
    if (h.items.length < 3) fail(`hub ${h.path}: ${h.items.length} camisetas`);
    else if (h.items.some((i) => !isClassicKit(i.product))) fail(`hub ${h.path} con camisetas fuera de 2007-2019`);
    else if (!/(2007-2009|2007-2019|2010-2019)/.test(h.title)) fail(`título hub ${l}: "${h.title}"`);
    else if (!/€/.test(h.intro) || !h.intro.includes(String(h.items.length))) fail(`intro hub ${l} sin cifras: "${h.intro}"`);
    else hubOk++;
  }
}
for (const [spec, why] of [[{ team: "nadie" }, "equipo inexistente"], [{ team: teams[0]?.team, decade: "1995" }, "década no redonda"], [{ decade: "2010" }, "década sin equipo"]] as const) {
  if (classicHub(spec as never, "es")) fail(`hub ${JSON.stringify(spec)} (${why}) debería ser 404`);
}

// ---------- 3. fichas
let fichas = 0;
const withWord: Record<string, number> = {};
for (const p of products.filter(isClassicKit)) {
  fichas++;
  const trail = jerseyTrail(p, "es").map((c) => c.path);
  const hubs = jerseyRelated(p, "es").hubs.map((h) => h.href);
  const hasHub = teams.some((t) => t.team === p.teamKey);
  if (!trail.includes("/clasicas")) fail(`ficha ${p.id} sin miga a /clasicas`);
  if (hasHub && (!trail.includes(`/clasicas/${p.teamKey}`) || !hubs.includes(`/es/clasicas/${p.teamKey}`))) fail(`ficha ${p.id} sin enlace a su hub`);
  for (const l of LOCALES) {
    const t = jerseyTitle(p, l).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    if (/\bretro\b/.test(t)) fail(`ficha ${l}/${p.id} dice retro: "${t}"`);
    if (/\bclass?i(c|ca|que)\b/.test(t)) withWord[l] = (withWord[l] ?? 0) + 1;
  }
}

// ---------- 4. URLs y consultas
const paths = extraHubPaths().filter((h) => h.kind.startsWith("clasicas"));
console.log(`fronteras: ${CASES.length} casos; hubs clásicas: portada + ${teams.length} de equipo + ${teamDecades.length} de equipo+década = ${paths.length} rutas x ${LOCALES.length} idiomas = ${paths.length * LOCALES.length} URLs; títulos/intro correctos ${hubOk}/${specs.length * LOCALES.length}; fichas 2007-2019 revisadas: ${fichas}, con "clásica" en el título: ${LOCALES.map((l) => `${l} ${withWord[l] ?? 0}`).join(", ")}`);
for (const [q, team] of [["retro orlando city shirt", "orlandocity"], ["retro hellas verona football shirt", "hellasverona"], ["retro rennes", "rennes"]] as const) {
  const h = classicHub({ team }, "en");
  const n = classicTeamItems(team).length;
  console.log(h
    ? `ok    "${q}" -> /en${h.path} (${n} camisetas): "${h.title}" · desc: "${h.description}"`
    : `INFO  "${q}": sin hub (${n} clásicas y ${retroTeamItems(team).length} retro, mínimo 3); sus fichas enlazan a /clasicas`);
}

if (fails.length) {
  console.log(`\n${fails.length} fallos:`);
  for (const f of fails.slice(0, 40)) console.log("  " + f);
  process.exit(1);
}
console.log("\nOK");
