// Comprobación del formato de precios por idioma (2026-10-20).
// Ejecutar: npx tsx scripts/check_money_format.mts
//   Con páginas renderizadas (verificación posterior, máx. 3 req/s):
//   npx tsx scripts/check_money_format.mts --base https://football-cult.com
//   npx tsx scripts/check_money_format.mts --base http://localhost:3201   (next dev bajo flock /tmp/fc-dev.lock)
// 1) Casos fijos: el número sigue el idioma de la página; EUR con símbolo, el resto con código.
// 2) Sin locale se mantiene el comportamiento anterior (moneda manda).
// 3) Con --base: en /en ningún texto visible lleva "22,20 €" (patrón de /es pegado a /en).
import assert from "node:assert/strict";
import { formatOfferMoney, approxPriceLabel } from "../src/lib/offerMoney";
import type { Locale } from "../src/lib/i18n/translations";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import DealCardModule from "../src/components/hubs/DealCard";
// tsx entrega el módulo CJS con el default anidado.
const DealCard = (DealCardModule as unknown as { default?: typeof DealCardModule }).default ?? DealCardModule;

const NB = "\u00A0";
const NNB = "\u202F";
// [importe, moneda, es, en, pt, fr, it]
const CASES: [number, "EUR" | "USD" | "CLP" | "MXN" | "COP", string, string, string, string, string][] = [
  [22.2, "EUR", `22,20${NB}€`, "€22.20", `22,20${NB}€`, `22,20${NB}€`, `22,20${NB}€`],
  [1234.5, "EUR", `1.235${NB}€`, "€1,235", `1${NB}235${NB}€`, `1${NNB}235${NB}€`, `1.235${NB}€`],
  [36.99, "USD", `36,99${NB}USD`, `USD${NB}36.99`, `36,99${NB}USD`, `36,99${NB}USD`, `36,99${NB}USD`],
  [109.99, "EUR", `110${NB}€`, "€110", `110${NB}€`, `110${NB}€`, `110${NB}€`],
  [1076.5, "CLP", `1.077${NB}CLP`, `CLP${NB}1,077`, `1${NB}077${NB}CLP`, `1${NNB}077${NB}CLP`, `1.077${NB}CLP`],
  [1999, "MXN", `1.999${NB}MXN`, `MXN${NB}1,999`, `1${NB}999${NB}MXN`, `1${NNB}999${NB}MXN`, `1.999${NB}MXN`],
  [189975, "COP", `189.975${NB}COP`, `COP${NB}189,975`, `189${NB}975${NB}COP`, `189${NNB}975${NB}COP`, `189.975${NB}COP`],
  [1234.56, "EUR", `1.235${NB}€`, "€1,235", `1${NB}235${NB}€`, `1${NNB}235${NB}€`, `1.235${NB}€`],
  [0.5, "EUR", `0,50${NB}€`, "€0.50", `0,50${NB}€`, `0,50${NB}€`, `0,50${NB}€`],
];
const LOCALES: Locale[] = ["es", "en", "pt", "fr", "it"];
for (const [amount, cur, ...want] of CASES)
  LOCALES.forEach((l, i) => assert.equal(formatOfferMoney(amount, cur, l), want[i], `${amount} ${cur} /${l}`));

// Sin locale: igual que antes (check_es_spain.mts lo cubre con más casos).
assert.equal(formatOfferMoney(22.2, "EUR"), `22,20${NB}€`);
assert.equal(formatOfferMoney(36.99, "USD"), `USD${NB}36.99`);

// "≈" de otra moneda: siempre con código, número del idioma.
assert.equal(approxPriceLabel(100, "EUR", "USD", "en"), `≈ USD${NB}108`);
assert.equal(approxPriceLabel(100, "EUR", "USD", "es"), `≈ 108${NB}USD`);
assert.equal(approxPriceLabel(100, "EUR", "ARS", "es"), `≈ 175.460${NB}ARS`);
assert.equal(approxPriceLabel(50, "EUR", "EUR", "en"), null);
assert.equal(approxPriceLabel(108, "USD", "XXX", "en"), `≈ EUR${NB}100`);
// Plantilla de servidor real (tarjeta de /ofertas, /regalos, /black-friday): en /en sin "NN,NN €".
const card = (l: Locale) =>
  renderToStaticMarkup(createElement(DealCard, { href: "/x", title: "Kit", image: "", price: 22.2, currency: "EUR", store: "Shop", locale: l }));
assert.ok(card("en").includes("€22.20") && !/\d,\d{2}\s€/.test(card("en")), "DealCard /en");
assert.ok(card("es").includes("22,20") && card("fr").includes("22,20"), "DealCard /es /fr");
console.log(`ok: ${CASES.length * LOCALES.length} formatos fijos + sin locale + approx`);

// ---- Páginas renderizadas (opcional) ----
const base = process.argv[process.argv.indexOf("--base") + 1];
if (process.argv.includes("--base") && base) {
  const PAGES = ["/en", "/en/botas", "/en/ofertas"]; // home + listado de botas + tarjetas de servidor
  const BAD = /\d+,\d{2}[\s\u00A0\u202F]€/;
  const bad: string[] = [];
  for (const p of PAGES) {
    const res = await fetch(base + p, { headers: { "user-agent": "football-cult-check/1.0" } });
    assert.equal(res.status, 200, `${p}: HTTP ${res.status}`);
    const html = await res.text();
    // Solo texto visible: fuera <script> (JSON-LD, RSC) y <style>, etiquetas fuera.
    const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
    const hit = text.match(new RegExp(`.{0,40}${BAD.source}.{0,20}`));
    console.log(`${p}: ${hit ? "FALLA ..." + hit[0].replace(/\s+/g, " ") : "sin 'NN,NN €'"}  (€NN.NN: ${(text.match(/€\d/g) ?? []).length})`);
    if (hit) bad.push(p);
    await new Promise((r) => setTimeout(r, 400));
  }
  assert.deepEqual(bad, [], `Formato de /es en /en: ${bad.join(", ")}`);
}
