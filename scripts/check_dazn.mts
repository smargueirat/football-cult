// Chequeo de la caducidad de la publicidad de DAZN (src/data/daznAds.ts):
//   npx tsx scripts/check_dazn.mts
import assert from "node:assert";
import { DAZN_BY_COUNTRY, daznFor, landingHref } from "../src/data/daznAds";
import { LEAGUES } from "../src/data/teamMeta";

// El banner de Francia ("Jusqu'au 29 septembre") se ve hasta ese día y luego no;
// la tarjeta de texto (sin fecha) sigue.
assert.equal(daznFor("FR", "ligue-1", "2026-09-29")!.banners.length, 2);
assert.equal(daznFor("FR", "ligue-1", "2026-09-30")!.banners.length, 0);
// Derechos: liga que DAZN no tiene en el país, o derecho vencido -> nada.
assert.ok(daznFor("GB", "serie-a", "2026-10-09"));
assert.equal(daznFor("GB", "premier-league", "2026-10-09"), null);
assert.equal(daznFor("CA", "bundesliga", "2028-07-01"), null);
assert.equal(daznFor("US", "mls", "2026-10-09"), null);
// Los seis programas, con su landing en su idioma y slugs de liga que existen.
assert.deepStrictEqual(Object.keys(DAZN_BY_COUNTRY).sort(), ["CA", "ES", "FR", "GB", "IE", "JP"]);
const slugs = new Set(LEAGUES.map((l) => l.slug));
for (const [c, p] of Object.entries(DAZN_BY_COUNTRY)) {
  for (const slug of Object.keys(p.leagues)) assert.ok(slugs.has(slug), `${c}: liga ${slug} no existe`);
  assert.match(landingHref(p), new RegExp(`awinmid=${p.mid}&awinaffid=3013769&ued=https%3A%2F%2Fwww\\.dazn\\.com%2F[a-z]{2}-${c}%2Fwelcome`));
}
console.log("ok");
