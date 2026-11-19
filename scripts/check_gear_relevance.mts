// Chequeo del orden por relevancia de /ropa:  npx tsx scripts/check_gear_relevance.mts
// Lo atado a un club/selección va antes que lo genérico, las 48 del HTML son
// las primeras del listado completo (sin salto al cargar el JSON) y no se
// pierde ninguna ficha.
import assert from "node:assert";
import { apparelProducts } from "../src/data/apparel";
import { gearListProps, slimGear } from "../src/lib/gearList";

const all = slimGear(apparelProducts, "ropa");
assert.equal(all.length, apparelProducts.length, "no puede perder fichas");
assert.equal(new Set(all.map((p) => p.id)).size, all.length, "ids duplicados");

const { initial, url } = gearListProps(all, "ropa");
assert.deepEqual(initial.map((p) => p.id), all.slice(0, 48).map((p) => p.id), "las 48 del HTML = primeras del JSON completo");
assert.match(url, /^\/api\/gear-list\/ropa\?v=/);

// Mismo orden sin importar el orden de entrada (el JSON y la página parten del mismo array, pero no deben depender de él).
const again = slimGear([...apparelProducts].reverse(), "ropa");
assert.deepEqual(again.map((p) => p.id), all.map((p) => p.id), "orden estable");

// Las genéricas de la queja original no pueden abrir el listado.
const first = initial.map((p) => `${p.brand} ${p.model}`);
for (const bad of [/brazalete/i, /sol'?s/i, /lisa/i]) assert.ok(!first.some((t) => bad.test(t)), `genérica en las primeras 48: ${bad}`);

// Las demás secciones conservan su orden (cuestan lo mismo que antes).
const gloves = slimGear(apparelProducts.slice(0, 5));
assert.deepEqual(gloves.map((p) => p.id), apparelProducts.slice(0, 5).map((p) => p.id));

first.forEach((t, i) => console.log(String(i + 1).padStart(2), t));
console.log("ok", all.length);
