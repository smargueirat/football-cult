// Comprobación de las páginas de datos (2026-10-09): bajadas verificadas,
// ofertas de la semana, mínimos, guías con cifras, llms.txt y el código del
// fabricante leído de los títulos.
//   npx tsx scripts/check_data_pages.mts
// Falla (exit 1) si algo no cumple su propia regla o si sale NaN/undefined.
import { titleCode, productCode } from "../src/lib/offerGtin";
import { gearMpn } from "../src/lib/seoMeta";
import { priceStudy } from "../src/lib/priceStudy";
import { LOW_MIN_DAYS, archiveDates, historicLowRows, verifiedDropRows, weeklyRows } from "../src/lib/dealsData";
import { guideQa } from "../src/components/GuideData";
import { GUIDE_SLUGS } from "../src/lib/guides";
import { LOCALES } from "../src/lib/i18n/locales";
import { llmsTxt } from "../src/lib/llmsTxt";
import { siteFaq } from "../src/lib/siteFacts";
import { ticketFaq } from "../src/lib/ticketFacts";

let failed = 0;
const ok = (cond: boolean, msg: string) => {
  if (!cond) {
    failed++;
    console.error("FALLA:", msg);
  }
};

ok(titleCode("Camiseta Nike Francia visitante 2018 VaporKnit 893873-100") === "893873-100", "código Nike de 6 dígitos");
ok(titleCode("Nike Norway 2026 Stadium Goalkeeper Jersey IB5321-718") === "IB5321-718", "código Nike nuevo");
ok(titleCode("PUMA Hombre Camiseta 773346-02") === "773346-02", "código Puma");
ok(titleCode("BOCA JUNIORS 25/26 - ADIDAS KV2847 - ASK SIZE") === "KV2847", "código adidas");
ok(titleCode("Nike shirt size XL2024") === undefined, "patrón corto sin adidas");
ok(productCode([{ url: "x", title: "Nike CD4232-455" }, { url: "y", title: "Nike CD4185-456" }]) === undefined, "dos códigos distintos = ninguno");
const gear = (id: string) => ({ id, brand: "adidas", model: "m", offers: [] });
ok(gearMpn(gear("footstorees-adidas-botas-predator-elite-fg-ie1802")) === "IE1802", "código adidas del id");
ok(gearMpn(gear("nikecl-nike-phantom-6-low-elite-fg-1788839-800")) === undefined, "código raro no se muestra");

const { last } = archiveDates();
const drops = verifiedDropRows();
for (const r of drops) ok(r.price < r.before && r.pct > 0 && r.since <= last, `bajada incoherente ${r.section}/${r.item.id}`);

const week = weeklyRows();
const from = new Date(Date.parse(last + "T00:00:00Z") - 6 * 86_400_000).toISOString().slice(0, 10);
const perSection = new Map<string, number>();
for (const r of week) {
  ok(r.since >= from && r.pct >= 5 && r.eur <= 1000, `semana fuera de regla ${r.section}/${r.item.id}`);
  perSection.set(r.section, (perSection.get(r.section) ?? 0) + 1);
}
for (const [s, n] of perSection) ok(n <= 12, `semana: ${n} en ${s}`);

const lows = historicLowRows();
for (const r of lows) ok(r.section !== "tickets" && r.price <= r.before * 0.97 + 1e-9 && (r.days ?? 0) >= LOW_MIN_DAYS, `mínimo fuera de regla ${r.section}/${r.item.id}`);

// Estudio de precios (/estudios/precios-camisetas): cada fila tiene UN
// ganador, así que las victorias suman las filas; la tabla de tiendas tiene
// tantas filas como dice la cabecera; y nadie gana más de lo que compara.
const st = priceStudy();
const winsSum = st.storeRanking.reduce((n, r) => n + r.wins, 0);
ok(st.products > 0 && winsSum === st.products, `estudio: victorias ${winsSum} != camisetas ${st.products}`);
ok(st.storeRanking.length === st.stores, `estudio: ${st.storeRanking.length} filas de tiendas, la cabecera dice ${st.stores}`);
for (const r of st.storeRanking) ok(r.wins <= r.appearances && r.appearances > 0, `estudio: ${r.store} ${r.wins}/${r.appearances}`);
ok(st.rows.every((r) => r.low <= r.high && r.gapPct >= 0), "estudio: fila con low > high");
console.log(`estudio: ${st.products} camisetas, ${st.stores} tiendas, media ${st.avgGapPct.toFixed(1)} %, ganadoras: ${st.storeRanking.map((r) => `${r.store} ${r.wins}/${r.appearances}`).join(", ")}`);

const bad = /NaN|undefined|Infinity/;
for (const l of LOCALES) {
  for (const s of GUIDE_SLUGS) for (const x of guideQa(s, l)) ok(!bad.test(x.q + x.a), `guía ${s} (${l}): ${x.a}`);
  for (const x of siteFaq(l).qa) ok(!bad.test(x.a), `home (${l}): ${x.a}`);
  for (const x of ticketFaq(l)?.qa ?? []) ok(!bad.test(x.a), `entradas (${l}): ${x.a}`);
}
const txt = llmsTxt(true);
ok(txt.startsWith("# Football Cult") && !bad.test(txt), "llms-full.txt");
for (const s of GUIDE_SLUGS) ok(txt.includes(`/es/guia/${s}`), `llms.txt sin la guía ${s}`);

console.log(`bajadas ${drops.length}, semana ${week.length}, mínimos ${lows.length}, llms-full ${txt.length} caracteres (archivo hasta ${last})`);
console.log("es:", guideQa("cuando-bajan-de-precio-las-camisetas", "es").map((x) => x.a).join(" | "));
if (failed) {
  console.error(`${failed} comprobaciones fallidas`);
  process.exit(1);
}
console.log("ok");
