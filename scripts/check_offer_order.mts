// Chequeo del orden de ofertas (offerOrder.ts), del "≈" en otra moneda y de
// que toda tienda del catálogo tenga entrada en storeShipping:
//   npx tsx scripts/check_offer_order.mts
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { rankOffers } from "../src/lib/offerOrder";
import { approxPriceLabel } from "../src/lib/offerMoney";
import { offerShipsTo, storeShipping } from "../src/lib/productMeta";

type O = { store: string; total: number };
const order = (offers: O[], ships?: (o: O) => boolean) =>
  rankOffers(offers, (o) => o.total, ships).map((o) => o.store);

// Precio manda: eBay (2 %) más barato por más de 1 % le gana a adidas (8 %).
assert.deepStrictEqual(order([{ store: "AdidasES", total: 100 }, { store: "eBay", total: 95 }]), ["eBay", "AdidasES"]);
// Empate dentro de ±1 %: desempata la comisión (adidas 8 % > eBay 2 %).
assert.deepStrictEqual(order([{ store: "eBay", total: 100 }, { store: "AdidasES", total: 100.9 }]), ["AdidasES", "eBay"]);
// Justo fuera de la ventana (1,5 %): vuelve a mandar el precio.
assert.deepStrictEqual(order([{ store: "eBay", total: 100 }, { store: "AdidasES", total: 101.5 }]), ["eBay", "AdidasES"]);
// Igual comisión: se mantiene el orden por precio (sort estable).
assert.deepStrictEqual(order([{ store: "FootStoreFR", total: 100.5 }, { store: "FootStoreES", total: 100 }]), ["FootStoreES", "FootStoreFR"]);
// La que no envía al país va al final aunque sea la más barata y la de más comisión.
const es = (o: O) => offerShipsTo(o.store, "ES");
assert.deepStrictEqual(order([{ store: "NikeAR", total: 50 }, { store: "SportIsGoodES", total: 90 }], es), ["SportIsGoodES", "NikeAR"]);

// Tiendas solo-país: una bota de Nike AR nunca es comprable desde España.
assert.equal(offerShipsTo("NikeAR", "ES"), false);
assert.equal(offerShipsTo("NikeAR", "AR"), true);
assert.equal(offerShipsTo("ClovisCalcadosBR", "ES"), false);
assert.equal(offerShipsTo("eBay ES", "AR"), true); // eBay: envío real en vivo

// "≈" en la moneda del visitante; nada si ya está en ella; EUR si no la soportamos.
const approx = (...a: Parameters<typeof approxPriceLabel>) => approxPriceLabel(...a)?.replace(/\s/g, " ") ?? null;
assert.equal(approx(108, "USD", "EUR"), "≈ 100 EUR");
assert.equal(approx(100, "EUR", "EUR"), null);
assert.equal(approx(86, "GBP", "CHF"), "≈ 100 EUR");
assert.ok(approxPriceLabel(100, "EUR", "ARS")?.includes("ARS"));

// Toda tienda que aparece en los datos tiene entrada (salvo eBay, a propósito).
const missing = new Set<string>();
for (const f of ["products", "boots", "apparel", "gloves", "balls", "training", "tickets"]) {
  const src = readFileSync(new URL(`../src/data/${f}.ts`, import.meta.url), "utf8");
  for (const m of src.matchAll(/"?store"?: ?"([^"]+)"/g)) {
    if (!m[1].startsWith("eBay") && !(m[1] in storeShipping)) missing.add(m[1]);
  }
}
assert.deepStrictEqual([...missing], [], `tiendas sin storeShipping: ${[...missing].join(", ")}`);

console.log("ok");
