// Chequeo de src/lib/goOut.ts (sub-id por red, destino sin tracking, filtro de bots):
//   npx tsx scripts/check_go_out.mts
// Los enlaces de ejemplo son reales del catálogo (oct-2026).
import assert from "node:assert";
import { botReason, resetBotState, untracked, withSubId } from "../src/lib/goOut";

const src = { section: "camiseta", locale: "es", country: "ES", origin: "ficha3b", productId: "rma-home-202526" };
const ALL = "camiseta_es_ES_ficha3b_rma-home-202526";

const cases: [string, string, string][] = [
  ["Awin pclick", "https://www.awin1.com/pclick.php?p=43791561083&a=3013769&m=23805",
    "https://www.awin1.com/pclick.php?p=43791561083&a=3013769&m=23805&clickref=camiseta_es_ES&clickref2=rma-home-202526&clickref3=ficha3b"],
  ["Awin cread", "https://www.awin1.com/cread.php?awinmid=6667&awinaffid=3013769&ued=https%3A%2F%2Fwww.x.es%2Fa%3Fb%3D1",
    "https://www.awin1.com/cread.php?awinmid=6667&awinaffid=3013769&ued=https%3A%2F%2Fwww.x.es%2Fa%3Fb%3D1&clickref=camiseta_es_ES&clickref2=rma-home-202526&clickref3=ficha3b"],
  ["eBay", "https://www.ebay.es/itm/137722044673?_skw=Nashville+SC+third+soccer+jersey&hash=item2010dfa101%3Ag%3ANSMAAeSwd7RpumZf&mkevt=1&mkcid=1&mkrid=1185-53479-19255-0&campid=5339184386&customid=&toolid=10049",
    `https://www.ebay.es/itm/137722044673?_skw=Nashville+SC+third+soccer+jersey&hash=item2010dfa101%3Ag%3ANSMAAeSwd7RpumZf&mkevt=1&mkcid=1&mkrid=1185-53479-19255-0&campid=5339184386&customid=${ALL}&toolid=10049`],
  ["TradeTracker", "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fx",
    `https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=${ALL}&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fx`],
  ["Rakuten", "https://click.linksynergy.com/link?id=aG1VysDxsgw&offerid=2024748.5419617643221643756375519&type=15&murl=https%3A%2F%2Fwww.santosstore.com.br%2F2IB-2318-026",
    `https://click.linksynergy.com/link?id=aG1VysDxsgw&offerid=2024748.5419617643221643756375519&type=15&murl=https%3A%2F%2Fwww.santosstore.com.br%2F2IB-2318-026&u1=${ALL}`],
  ["Skimlinks", "https://go.skimresources.com/?id=307104X1795379&xs=1&url=https%3A%2F%2Fwww.prodirectsport.es%2Fp",
    `https://go.skimresources.com/?id=307104X1795379&xs=1&url=https%3A%2F%2Fwww.prodirectsport.es%2Fp&xcust=${ALL}`],
  ["Webgains", "https://track.webgains.com/click.html?wgcampaignid=1&wgprogramid=2&wgtarget=https%3A%2F%2Fx.co.uk%2F",
    `https://track.webgains.com/click.html?wgcampaignid=1&wgprogramid=2&wgtarget=https%3A%2F%2Fx.co.uk%2F&clickref=${ALL}`],
  // Sin sub-id: tal cual.
  ["Amazon", "https://www.amazon.es/dp/B09HN39LXJ?tag=footballcult-21", "https://www.amazon.es/dp/B09HN39LXJ?tag=footballcult-21"],
  ["Soicos", "https://ad.soicos.com/sclick?aid=56058&pid=14271&dl=https%3A%2F%2Fwww.nike.cl%2Fx%2Fp", "https://ad.soicos.com/sclick?aid=56058&pid=14271&dl=https%3A%2F%2Fwww.nike.cl%2Fx%2Fp"],
  ["Tienda directa", "https://www.prodirectsport.es/products/x-4000139", "https://www.prodirectsport.es/products/x-4000139"],
];
for (const [name, input, want] of cases) {
  const got = withSubId(input, src);
  assert.strictEqual(got, want, name);
  console.log(`${name.padEnd(15)} ${got}`);
}
// Ids raros no rompen la URL; el informe de Awin solo muestra 50 car.
assert.match(withSubId("https://www.awin1.com/pclick.php?p=1", { ...src, productId: "a b&c=d/é".repeat(40) }), /^https:\/\/www\.awin1\.com\/pclick\.php\?p=1&clickref=camiseta_es_ES&clickref2=[\w-]{1,200}&clickref3=ficha3b$/);
assert.ok(withSubId(cases[2][1], { ...src, productId: "x".repeat(400) }).match(/customid=([^&]*)/)![1].length <= 256);

// Destino sin tracking para los robots.
assert.strictEqual(untracked(cases[1][1]), "https://www.x.es/a?b=1");
assert.strictEqual(untracked(cases[0][1]), null); // pclick: el destino lo resuelve Awin
assert.strictEqual(untracked(cases[3][1]), "https://www.futbolemotion.com/es/x");
assert.strictEqual(untracked(cases[4][1]), "https://www.santosstore.com.br/2IB-2318-026");
assert.strictEqual(untracked(cases[8][1]), "https://www.nike.cl/x/p");
assert.strictEqual(untracked(cases[7][1]), "https://www.amazon.es/dp/B09HN39LXJ");
assert.doesNotMatch(untracked(cases[2][1])!, /campid|mkevt|customid|toolid|mkrid|mkcid/);
assert.match(untracked(cases[2][1])!, /^https:\/\/www\.ebay\.es\/itm\/137722044673\?_skw=/);

// ---- Filtro de bots
const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const real = (ua: string, ip: string, extra: Record<string, string> = {}) =>
  new Headers({ "user-agent": ua, "accept-language": "es-ES,es;q=0.9", "sec-fetch-mode": "navigate", "sec-fetch-site": "same-origin", "cf-connecting-ip": ip, ...extra });
let now = Date.parse("2026-10-09T10:00:00Z");
resetBotState();

// Personas: Chrome real, iPhone, Telegram/marcador (cross-site, none), Safari viejo sin Sec-Fetch.
assert.strictEqual(botReason(real(CHROME, "83.1.1.1"), true, now), undefined);
assert.strictEqual(botReason(real(IOS, "83.2.2.2"), false, now), undefined);
assert.strictEqual(botReason(real(CHROME, "83.3.3.3", { "sec-fetch-site": "cross-site" }), false, now), undefined);
assert.strictEqual(botReason(new Headers({ "user-agent": IOS.replace("17_5", "15_0"), "accept-language": "es" }), false, now), undefined);
// Una persona que abre 8 ofertas en un minuto sigue siendo persona.
for (let i = 0; i < 8; i++) assert.strictEqual(botReason(real(CHROME, "88.9.9.9"), true, now + i * 5000), undefined, `persona ${i}`);

// Robots.
assert.strictEqual(botReason(new Headers({ "user-agent": CHROME, "sec-purpose": "prefetch" }), false, now), "prefetch");
assert.strictEqual(botReason(new Headers({ "user-agent": "Googlebot/2.1" }), false, now), "ua");
assert.strictEqual(botReason(new Headers({}), false, now), "ua");
assert.strictEqual(botReason(new Headers({ "user-agent": CHROME, "accept-language": "en" }), false, now), "headers"); // Chrome 128 sin Sec-Fetch
assert.strictEqual(botReason(new Headers({ "user-agent": IOS }), false, now), "headers"); // sin Accept-Language ni Sec-Fetch
// Ráfaga desde una subred: a partir del clic 11 en un minuto.
resetBotState();
const verdicts = Array.from({ length: 12 }, (_, i) => botReason(real(CHROME, `45.10.20.${i}`), false, now + i * 3000));
assert.deepStrictEqual(verdicts.slice(0, 10), Array(10).fill(undefined));
assert.deepStrictEqual(verdicts.slice(10), ["rate", "rate"]);
// Ráfaga global con IP rotando (proxies): sin j=1 es robot, con j=1 persona.
resetBotState();
for (let i = 0; i < 61; i++) botReason(real(CHROME, `${10 + i}.1.1.1`), false, now + i * 30_000);
now += 61 * 30_000;
assert.strictEqual(botReason(real(CHROME, "99.1.1.1"), false, now), "surge");
assert.strictEqual(botReason(real(CHROME, "99.2.2.2"), true, now), undefined);
// Pasada la hora sin ráfaga, sin j=1 vuelve a ser persona.
assert.strictEqual(botReason(real(CHROME, "99.3.3.3"), false, now + 2 * 3600_000), undefined);

console.log("ok");
