// Chequeo de pickOfficial (src/lib/officialStores.ts): «Mejor oficial» y adónde va la barra fija.
//   npx tsx scripts/check_best_official.mts
import assert from "node:assert/strict";
import { pickOfficial } from "../src/lib/officialStores";

type O = { store: string; total: number };
const total = (o: O) => o.total;
const fjh = { store: "FansJerseyHub", total: 30 };
const ebay = { store: "eBay ES", total: 40 };

// La más barata ya es oficial: sin «Mejor oficial», la barra va a ella.
const fe = { store: "FutbolEmotion", total: 90 };
assert.deepEqual(pickOfficial(fe, [fe, { store: "FootStoreES", total: 95 }], total), { official: undefined, cta: fe });

// Réplica más barata y la oficial más barata a menos de un 15 % más: la barra va a la oficial.
const cerca = { store: "FootStoreES", total: 34.49 };
assert.deepEqual(pickOfficial(fjh, [fjh, ebay, cerca, { store: "PlanetFoot", total: 50 }], total), { official: cerca, cta: cerca });

// Justo un 15 % más (o más): la barra se queda en la más barata, la chapa se muestra igual.
const lejos = { store: "FootStoreES", total: 34.5 };
assert.deepEqual(pickOfficial(fjh, [fjh, lejos], total), { official: lejos, cta: fjh });

// Sin ninguna oficial: nada que destacar, barra a la más barata.
assert.deepEqual(pickOfficial(fjh, [fjh, ebay], total), { official: undefined, cta: fjh });

// Sin ofertas.
assert.deepEqual(pickOfficial(undefined, [], total), { official: undefined, cta: undefined });

console.log("check_best_official: OK");
