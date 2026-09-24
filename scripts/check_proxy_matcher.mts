// Chequeo del matcher de src/proxy.ts:  npx tsx scripts/check_proxy_matcher.mts
//
// El proxy corre como función de Node en cada request que matchee, así
// que el matcher es lo que decide cuánta CPU gastamos. Y si se rompe, se
// rompe el ruteo por idioma entero. Vale un test.
import assert from "node:assert";
import { config } from "../src/proxy";

const re = new RegExp(`^${config.matcher[0]}$`);
const runs = (path: string) => re.test(path);

// Entra: no tiene idioma, hay que redirigir
for (const p of ["/", "/camiseta/algo", "/botas", "/estudios/precios-camisetas", "/ofertas", "/entrenamiento"]) {
  assert.strictEqual(runs(p), true, `deberia redirigir: ${p}`);
}
// "/estudios" empieza por "es": sin el (?:/|$) se saltearia la redireccion
assert.strictEqual(runs("/estudios"), true, "/estudios NO es el locale es");
assert.strictEqual(runs("/entrenamiento"), true, "/entrenamiento NO es el locale en");
assert.strictEqual(runs("/italia"), true, "/italia NO es el locale it");
assert.strictEqual(runs("/francia"), true, "/francia NO es el locale fr");
assert.strictEqual(runs("/ptqueseayo"), true, "no es el locale pt");

// No entra: ya tiene idioma -> se sirve sin ejecutar nada
for (const p of ["/es", "/en", "/pt", "/fr", "/it", "/es/botas", "/en/indice/camisetas/1", "/it/estudios/precios-camisetas"]) {
  assert.strictEqual(runs(p), false, `no deberia ejecutar el proxy: ${p}`);
}
// No entra: excluidos de siempre
for (const p of ["/api/geo", "/robots.txt", "/sitemap.xml", "/feed-us.xml", "/_next/static/chunk.js", "/favicon.ico", "/icon.png"]) {
  assert.strictEqual(runs(p), false, `no deberia ejecutar el proxy: ${p}`);
}
console.log("OK: matcher del proxy");
