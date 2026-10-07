// Chequeo de offersForCountry (botas y equipamiento respetan el país de envío):
//   npx tsx scripts/check_offers_for_country.mts
import assert from "node:assert";
import { offersForCountry } from "../src/lib/productMeta";

const stores = (offers: { store: string }[]) => offers.map((o) => o.store);
const cl = { store: "AdidasCL", price: 90000 };
const eu = { store: "PlanetFoot", price: 90 };

// Solo-CL junto a tienda europea: ES se queda con la europea, CL con ambas
assert.deepStrictEqual(stores(offersForCountry([cl, eu], "ES")), ["PlanetFoot"]);
assert.deepStrictEqual(stores(offersForCountry([cl, eu], "CL")), ["AdidasCL", "PlanetFoot"]);

// Ninguna envía al país: devuelve todas (la ficha no desaparece)
assert.deepStrictEqual(stores(offersForCountry([cl], "ES")), ["AdidasCL"]);

console.log("ok");
