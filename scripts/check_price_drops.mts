// Chequeo de las bajadas verificadas (priceArchive.verifiedDrop / massDropDays)
// y de los precios de plantilla de entradas:
//   npx tsx scripts/check_price_drops.mts
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { appendChanges, loadArchive, massDropDays, verifiedDrop } from "../src/lib/priceArchive";
import { ticketTemplatePrices } from "../src/lib/offerMoney";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-drops-"));
const day = (n: number) => new Date(Date.UTC(2026, 9, 1 + n)).toISOString().slice(0, 10);
// Cada serie: [día, precio]. Se escriben con el mismo appendChanges del rastreo.
const series: Record<string, [number, number][]> = {
  real: [[0, 100], [10, 80]], // 100 diez días, baja a 80
  corta: [[0, 50], [8, 100], [10, 80]], // 100 solo dos días: no
  yoyo: [[0, 80], [3, 100], [10, 80]], // ya estuvo a 80 en la ventana: no
  pico: [[0, 50], [13, 77], [19, 47]], // 77 seis días sobre 50 habitual: no
  sube: [[0, 80], [10, 100]],
};
// Día 19 es la última corrida con cambios (el archivo solo anota cambios).
for (let d = 0; d <= 19; d++) {
  const offers = Object.entries(series).flatMap(([url, pts]) => {
    const pt = [...pts].reverse().find(([n]) => n <= d);
    return pt ? [{ url, price: pt[1], currency: "EUR" }] : [];
  });
  appendChanges(offers, day(d), dir);
}
const a = loadArchive(dir);
const drop = verifiedDrop("real", 80, "EUR", a);
assert.ok(drop && drop.previous === 100 && drop.previousDays === 10 && Math.round(drop.pct) === 20 && drop.daysAtCurrent === 10);
assert.equal(verifiedDrop("real", 79, "EUR", a), null, "el catálogo y el archivo tienen que coincidir");
assert.equal(verifiedDrop("corta", 80, "EUR", a), null);
assert.equal(verifiedDrop("yoyo", 80, "EUR", a), null);
assert.equal(verifiedDrop("pico", 47, "EUR", a), null);
assert.equal(verifiedDrop("sube", 100, "EUR", a), null);

// 25 de 30 ofertas de una tienda bajan el mismo día: cambio del feed.
const mass = fs.mkdtempSync(path.join(os.tmpdir(), "fc-mass-"));
const shop = Array.from({ length: 30 }, (_, i) => ({ store: "X", url: `x${i}`, currency: "EUR" }));
appendChanges(shop.map((o) => ({ ...o, price: 100 })), day(0), mass);
appendChanges(shop.map((o, i) => ({ ...o, price: i < 25 ? 70 : 100 })), day(9), mass);
assert.ok(massDropDays(shop, loadArchive(mass)).has(`X|${day(9)}`));
assert.equal(massDropDays(shop.slice(25), loadArchive(mass)).size, 0);

// Mismo importe en 3+ partidos de una tienda = plantilla.
const t = ticketTemplatePrices([1, 2, 3].map(() => ({ offers: [{ store: "FTN", price: 423.17 }] })).concat([{ offers: [{ store: "FTN", price: 99 }] }]));
assert.ok(t.has("FTN|423.17") && !t.has("FTN|99"));

fs.rmSync(dir, { recursive: true });
fs.rmSync(mass, { recursive: true });
console.log("ok");
