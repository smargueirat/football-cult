// Comprueba que los títulos responden a las consultas reales de Search
// Console (sep-oct 2026) y a los patrones retro/código/comparador:
//   npx tsx scripts/check_query_patterns.mts          (resumen; exit 1 si algo falla)
//   npx tsx scripts/check_query_patterns.mts --list   (además, los títulos de ejemplo)
//
// 1. Hubs retro (equipo, equipo+década): título "Retro {team} football shirts:
//    vintage kits 1990-2006" (y equivalentes), intro con temporadas, tiendas y
//    precio; enlace hub -> todas sus fichas y ficha -> hub.
// 2. Fichas: "{team} {temporada}" en el título de todas; "retro" solo y
//    siempre en las de temporada <= 2006 (isVintageRetro).
// 3. Código del fabricante: en el título si cabe; si no, en la descripción.
// 4. Consultas concretas: cada palabra de la consulta en el título de la URL
//    objetivo ("euros"/"precio" = la descripción da un precio).
import { products } from "../src/data/products";
import { LOCALES } from "../src/lib/i18n/locales";
import { isVintageRetro } from "../src/lib/productMeta";
import { jerseyDescription, jerseyTitle, TITLE_MAX } from "../src/lib/seoMeta";
import { productCode } from "../src/lib/offerGtin";
import { classicHub, retroHub, retroTeamDecadeFacets, retroTeamFacets, retroTeamItems } from "../src/lib/extraHubs";
import { jerseyRelated, jerseyTrail } from "../src/lib/detailLinks";
import { teamName } from "../src/lib/hubs";
import { homeMeta } from "../src/lib/siteFacts";
import { ticketsPageMeta } from "../src/lib/ticketFacts";

const list = process.argv.includes("--list");
const fails: string[] = [];
const fail = (m: string) => fails.length < 400 && fails.push(m);

// ---------- 1. hubs retro
const HUB_RE: Record<string, RegExp> = {
  en: /^Retro .+ football shirts: vintage kits \d{4}(-\d{4})?( \| Football Cult)?$/,
  es: /^Camisetas retro de(l)? .+: equipaciones vintage \d{4}(-\d{4})?( \| Football Cult)?$/,
  pt: /^Camisas retrô .+: vintage \d{4}(-\d{4})?( \| Football Cult)?$/,
  fr: /^Maillots rétro .+ : maillots vintage \d{4}(-\d{4})?( \| Football Cult)?$/,
  it: /^Maglie retrò .+: maglie vintage \d{4}(-\d{4})?( \| Football Cult)?$/,
};
const teams = retroTeamFacets();
const teamDecades = retroTeamDecadeFacets();
let hubOk = 0;
for (const l of LOCALES) {
  const specs = [...teams.map((t) => ({ team: t.team })), ...teamDecades.map((d) => ({ team: d.team, decade: String(d.decade) }))];
  for (const spec of specs) {
    const h = retroHub(spec, l);
    if (!h) { fail(`hub ${l} ${JSON.stringify(spec)} no existe`); continue; }
    if (!HUB_RE[l].test(h.title)) fail(`título hub ${l}: "${h.title}"`);
    else if (!h.intro.includes(h.items[0].product.season) || !/€/.test(h.intro)) fail(`intro hub ${l} sin temporadas/precio: "${h.intro}"`);
    else if (h.items.length < 3) fail(`hub ${h.path} con ${h.items.length} camisetas`);
    else hubOk++;
  }
  if (list) for (const t of teams.slice(0, 3)) console.log(`  ${l} ${retroHub({ team: t.team }, l)!.title}`);
}
// Hub <-> fichas (solo es: los enlaces son los mismos en los 5 idiomas).
let linkFails = 0;
for (const t of teams) {
  for (const it of retroTeamItems(t.team)) {
    const trail = jerseyTrail(it.product, "es").map((c) => c.path);
    const hubs = jerseyRelated(it.product, "es").hubs.map((h) => h.href);
    if (!trail.includes(`/retro/${t.team}`) || !hubs.includes(`/es/retro/${t.team}`)) linkFails++;
  }
}
if (linkFails) fail(`${linkFails} fichas retro sin enlace a su hub de equipo`);
console.log(`hubs retro: ${teams.length} de equipo + ${teamDecades.length} de equipo+década; títulos/intro correctos ${hubOk}/${(teams.length + teamDecades.length) * LOCALES.length}; fichas sin enlace al hub: ${linkFails}`);

// ---------- 2 y 3. fichas
const RETRO_WORD = { test: (t: string) => /\bretro\b/.test(norm(t)) };
const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
for (const l of LOCALES) {
  let teamSeason = 0, retroOk = 0, vintage = 0, codeTitle = 0, codeDesc = 0, coded = 0;
  for (const p of products) {
    const t = jerseyTitle(p, l);
    if (norm(t).includes(norm(teamName(p.teamKey, l))) && t.includes(p.season)) teamSeason++;
    else fail(`ficha ${l}/${p.id} sin equipo+temporada: "${t}"`);
    const v = p.typeKey === "retro" && isVintageRetro(p);
    if (v) vintage++;
    if (RETRO_WORD.test(t) === v) { if (v) retroOk++; } else fail(`ficha ${l}/${p.id} retro=${v}: "${t}"`);
    const code = productCode(p.offers);
    if (code) {
      coded++;
      if (t.includes(code)) codeTitle++;
      else if (jerseyDescription(p, l).includes(code)) codeDesc++;
      else fail(`ficha ${l}/${p.id} sin código ${code}`);
    }
  }
  console.log(`fichas ${l}: equipo+temporada ${teamSeason}/${products.length}; retro ≤2006 con "retro" ${retroOk}/${vintage}; código en título ${codeTitle}/${coded}, solo en descripción ${codeDesc}`);
}

// ---------- 4. consultas concretas
const PRICE_WORDS = new Set(["euros", "euro", "precio", "price", "prix", "prezzo", "preco"]);
const STOP = new Set(["de", "da", "di", "del", "the", "a", "le", "la"]);
const jersey = (id: string, l: (typeof LOCALES)[number]) => {
  const p = products.find((x) => x.id === id);
  return p ? { title: jerseyTitle(p, l), description: jerseyDescription(p, l) } : undefined;
};
const QUERIES: { q: string; url: string; meta: () => { title: string; description: string } | undefined }[] = [
  { q: "893873 euros", url: "/en/camiseta/francia-retro-2018-away", meta: () => jersey("francia-retro-2018-away", "en") },
  { q: "ib5321-718", url: "/en/camiseta/noruega-goalkeeper-2026", meta: () => jersey("noruega-goalkeeper-2026", "en") },
  { q: "football price comparison", url: "/en", meta: () => homeMeta("en") },
  { q: "comparador camisetas fútbol", url: "/es", meta: () => homeMeta("es") },
  { q: "comparateur maillots foot", url: "/fr", meta: () => homeMeta("fr") },
  { q: "confronto prezzi maglie calcio", url: "/it", meta: () => homeMeta("it") },
  { q: "comparador preços camisas futebol", url: "/pt", meta: () => homeMeta("pt") },
  { q: "comparateur billets foot", url: "/fr/tickets", meta: () => ticketsPageMeta("fr") },
  { q: "entradas fútbol comparador", url: "/es/tickets", meta: () => ticketsPageMeta("es") },
];
// Consultas retro de Search Console: hub si el equipo tiene 3+ camisetas
// <= 2006; si no, se informa (la regla del sitio impide "retro" en 2007+).
for (const [q, team] of [["retro orlando city shirt", "orlandocity"], ["retro hellas verona football shirt", "hellasverona"], ["retro osasuna shirt", "osasuna"], ["retro rennes shirt", "rennes"], ["retro celtic shirt", "celtic"], ["retro lazio shirt", "lazio"]] as const) {
  const h = retroHub({ team }, "en");
  if (h) QUERIES.push({ q, url: `/en${h.path}`, meta: () => h });
  else {
    // 2007-2019: hub de clásicas (título sin "retro"; la palabra va en la descripción). Detalle en check_classic_kits.mts.
    const c = classicHub({ team }, "en");
    console.log(`INFO "${q}": sin hub retro (${retroTeamItems(team).length} camisetas ≤2006, mínimo 3); ${c ? `hub de clásicas /en${c.path}: "${c.title}"` : "sin hub de clásicas (menos de 3 de 2007-2019)"}`);
  }
}
for (const { q, url, meta } of QUERIES) {
  const m = meta();
  if (!m) { fail(`consulta "${q}": ${url} no existe`); continue; }
  const words = norm(m.title).split(/[^a-z0-9-]+/);
  const missing = norm(q).split(/\s+/).filter((w) => !STOP.has(w) && !(PRICE_WORDS.has(w) ? /\d/.test(m.description) : words.some((x) => x === w || x.startsWith(w) || x.includes(w))));
  console.log(`${missing.length ? "FALLA" : "ok   "} "${q}" -> ${url}: "${m.title}"${missing.length ? ` (faltan: ${missing.join(", ")})` : ""}${m.title.length > TITLE_MAX ? ` [${m.title.length} car.]` : ""}`);
  if (missing.length) fail(`consulta "${q}"`);
}

if (fails.length) {
  console.log(`\n${fails.length} fallos:`);
  for (const f of fails.slice(0, 40)) console.log("  " + f);
  process.exit(1);
}
console.log("\nOK");
