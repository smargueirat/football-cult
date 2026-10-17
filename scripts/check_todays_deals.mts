// Chequeo de "Mejores ofertas de hoy" (directDeals.ts → todaysDeals) con el
// catálogo real, e imprime las 8 primeras por idioma tal como las vería el
// país principal de cada idioma:
//   npx tsx scripts/check_todays_deals.mts
import assert from "node:assert";
import { todaysDeals } from "../src/lib/directDeals";
import { offerShipsTo, teamCategory } from "../src/lib/productMeta";
import { products } from "../src/data/products";
import { bootProducts } from "../src/data/boots";
import { isComparableStore } from "../src/lib/officialStores";

const HOME = ["camiseta", "botas", "ropa", "guantes", "pelotas"] as const;
const CC = { es: "ES", en: "GB", fr: "FR", it: "IT", pt: "PT" } as const;
const team = new Map(products.map((p) => [`camiseta/${p.id}`, p]));
const kidsBoot = new Set(bootProducts.filter((b) => b.ageGroup === "kids").map((b) => `botas/${b.id}`));
const KIDS = /niñ|\bkids?\b|junior|infantil|enfant|bambin|criança/i;

for (const l of ["es", "en", "fr", "it", "pt"] as const) {
  const all = todaysDeals(l, [...HOME], "home");
  const top = all.filter((d) => d.offers.some((o) => offerShipsTo(o.store, CC[l]))).slice(0, 8);
  console.log(`\n== ${l} (${CC[l]})`);
  top.forEach((d, i) => console.log(`${i + 1}. [${d.key.split("/")[0]}] ${d.name} | ${d.offers[0].store} ${d.offers[0].price} ${d.offers[0].currency} ${d.tag}`));

  // Reglas de siempre: tienda comparable, solo bajadas reales (tag), precio > 0.
  for (const d of all) {
    assert.ok(isComparableStore(d.offers[0].store), `${d.key}: tienda no comparable`);
    assert.ok(d.offers[0].price > 0 && d.tag, `${d.key}: sin precio o sin bajada`);
  }
  // Lo que envía al país del idioma va antes que lo que no.
  const ships = all.map((d) => offerShipsTo(d.offers[0].store, CC[l]));
  assert.ok(ships.indexOf(false) < 0 || !ships.slice(ships.indexOf(false)).includes(true), `${l}: un envío a ${CC[l]} quedó detrás de uno que no`);

  const four = top.slice(0, 4);
  // 4 primeras: sin repetir tienda ni equipo, sin niño, con club + selección + bota.
  assert.equal(new Set(four.map((d) => d.offers[0].store)).size, four.length, `${l}: tienda repetida en las 4 primeras`);
  const teams = four.flatMap((d) => (team.get(d.key) ? [team.get(d.key)!.teamKey] : []));
  assert.equal(new Set(teams).size, teams.length, `${l}: equipo repetido en las 4 primeras`);
  for (const d of four) assert.ok(!kidsBoot.has(d.key) && team.get(d.key)?.ageGroup !== "kids" && !KIDS.test(d.name), `${l}: niño arriba: ${d.name}`);
  const kinds = new Set(four.map((d) => (team.get(d.key) ? teamCategory[team.get(d.key)!.teamKey] : d.key.split("/")[0])));
  for (const k of ["club", "national", "botas"]) assert.ok(kinds.has(k), `${l}: falta ${k} en las 4 primeras`);
  // La primera tarjeta es una camiseta de club.
  assert.equal(teamCategory[team.get(top[0].key)?.teamKey as never], "club", `${l}: la 1.ª no es un club`);
}

// Los listados siguen filtrando por sección/categoría.
assert.ok(todaysDeals("es", ["botas"], "listado").every((d) => d.key.startsWith("botas/")));
assert.ok(todaysDeals("es", ["camiseta"], "listado", "national").every((d) => teamCategory[team.get(d.key)!.teamKey] === "national"));
console.log("\nOK todaysDeals");
