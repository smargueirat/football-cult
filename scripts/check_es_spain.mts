// Comprobación del español de España en /es (2026-10-09).
// Ejecutar: npx tsx scripts/check_es_spain.mts
// 1) Ningún texto ES de los diccionarios lleva voseo ni vocabulario rioplatense.
// 2) El glosario de títulos no duplica "Equipación" al traducir.
// 3) El euro se muestra como "1.234,56 €".
import assert from "node:assert/strict";
import { translations } from "../src/lib/i18n/translations.ts";
import { translateTitleVocabulary } from "../src/lib/i18n/titleGlossary.ts";
import { formatOfferMoney } from "../src/lib/offerMoney.ts";

const BAD =
  /(?<![\p{L}])(buscá|compará|comprá|elegí|probá|tocá|explorá|revisá|iniciá|escribí|describí|intentá|tenés|podés|querés|sabés|comprás|ahorrás|vos|acá|talles?|arquero|titular(?! del)|suplente|remera|canilleras|hincha|avisame|escribinos|contanos|dejanos|pelotas?)(?![\p{L}])/iu;

function walk(v: unknown, path: string, out: string[]) {
  if (typeof v === "string") {
    if (BAD.test(v)) out.push(`${path}: ${v.match(BAD)?.[0]} | ${v.slice(0, 80)}`);
  } else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, out);
  }
}
const bad: string[] = [];
walk(translations.es, "es", bad);
assert.deepEqual(bad, [], `Voseo o vocabulario rioplatense en /es:\n${bad.join("\n")}`);

assert.equal(
  translateTitleVocabulary("Camiseta tercera equipación Real Madrid 25/26", "es"),
  "Camiseta Tercera Equipación Real Madrid 25/26",
);
assert.equal(translateTitleVocabulary("Real Madrid Home Jersey 24/25", "es"), "Real Madrid Primera Equipación Camiseta 24/25");
assert.equal(translateTitleVocabulary("Maillot Third PSG", "es"), "Camiseta Tercera Equipación PSG");
assert.equal(translateTitleVocabulary("Camiseta tercera equipación Real Madrid 25/26", "en"), "Jersey Third Real Madrid 25/26");

assert.equal(formatOfferMoney(1234.56, "EUR").replace(/\s/g, " "), "1.235 €"); // >=100 sin decimales
assert.equal(formatOfferMoney(49.99, "EUR").replace(/\s/g, " "), "49,99 €");
assert.equal(formatOfferMoney(49.99, "USD").replace(/\s/g, " "), "USD 49.99");
console.log("ok: /es sin voseo, glosario sin duplicados, euros en formato español");
