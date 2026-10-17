#!/usr/bin/env node
// El CTA principal se puede TOCAR en móvil y el clic sale marcado como
// persona (j=1), en la home y en tres tipos de ficha:
//   node scripts/check_mobile_cta.mjs [https://football-cult.com]
// Móvil 390x844 táctil (iPhone), primera visita (banner de cookies abierto)
// y después de rechazar cookies. Las navegaciones a /go/ se ABORTAN: no se
// genera ningún clic de afiliado real ni llega nada a las redes.
//
// Por qué (2026-10-16): en 1.328 clics recientes ninguno traía j=1. En la
// primera visita el botón "Rechazar" del banner tapaba justo el "Ir a
// tienda" de la barra fija: el toque se lo llevaba el banner.
//
// Variables: PW_CORE (playwright-core), CHROME (ejecutable de Chromium);
// JERSEY / BOTA / GUANTE fijan las fichas (si no, la primera de cada listado);
// ONLY=home,camiseta,botas,guantes limita las páginas.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || "/home/piojo/vuelos-argentina/node_modules/playwright-core");
const CHROME = process.env.CHROME || "/home/piojo/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const BASE = (process.argv[2] || "https://football-cult.com").replace(/\/$/, "");
const JERSEY = process.env.JERSEY || "valencia-home-202627";
// BUST=1: query única por página para saltar la caché de Cloudflare (regla
// "paginas-html": guarda el HTML 2 h y no se purga al desplegar), y así probar
// el código que sirve el origen justo después de un deploy.
const bust = (path) => (process.env.BUST ? `${path}${path.includes("?") ? "&" : "?"}nc=${Date.now()}` : path);

const BAR = '[data-testid="best-offer-bar"] a[href^="/go/"]';
const HUBS = new Set(["marca", "linea", "terreno", "ninos", "futbol-sala", "tipo"]);

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const mobile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

// Primera ficha real enlazada desde un listado (los ids cambian con el catálogo).
async function firstFicha(section) {
  const ctx = await browser.newContext(mobile);
  const p = await ctx.newPage();
  await p.goto(BASE + bust(`/es/${section}`), { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForSelector(`a[href^="/es/${section}/"]`, { timeout: 60000 });
  const hrefs = await p.$$eval(`a[href^="/es/${section}/"]`, (as) => as.map((a) => a.getAttribute("href")));
  await ctx.close();
  const h = hrefs.find((x) => {
    const rest = x.split("/").slice(3);
    return rest.length === 1 && !HUBS.has(rest[0]);
  });
  if (!h) throw new Error(`sin fichas en /es/${section}`);
  return h;
}

async function check(name, path, selector, reject) {
  const ctx = await browser.newContext(mobile);
  const p = await ctx.newPage();
  const hits = [];
  await ctx.route("**/go/**", (r) => {
    hits.push(r.request().url());
    return r.abort();
  });
  const out = { name, state: reject ? "tras rechazar" : "1ª visita", path, ok: false, why: "" };
  try {
    await p.goto(BASE + bust(path), { waitUntil: "domcontentloaded", timeout: 60000 });
    if (reject) {
      await p.getByRole("button", { name: "Rechazar" }).click({ timeout: 10000 });
    } else {
      // El banner aparece tras hidratar: esperarlo para probar el peor caso.
      await p.getByRole("button", { name: "Rechazar" }).waitFor({ timeout: 10000 }).catch(() => {});
    }
    const cta = p.locator(selector).first();
    await cta.waitFor({ state: "visible", timeout: 30000 });
    // Al centro, como haría quien va a tocarlo: desde el rediseño de la
    // cabecera (2026-10-17) el botón de la home ya cae en la primera
    // pantalla, justo detrás del banner de cookies de la 1ª visita, y
    // scrollIntoViewIfNeeded no lo movía. La barra fija de las fichas no
    // se desplaza, así que para ella la prueba sigue siendo la misma.
    await cta.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await p.waitForTimeout(400); // transición de la barra
    const box = await cta.boundingBox();
    const vp = p.viewportSize();
    if (!box || box.y < 0 || box.y + box.height > vp.height) throw new Error(`fuera de pantalla ${JSON.stringify(box)}`);
    const cover = await p.evaluate(
      ([sel, x, y]) => {
        const all = [...document.querySelectorAll(sel)];
        const e = document.elementFromPoint(x, y);
        return all.some((el) => el === e || el.contains(e)) ? null : e ? `${e.tagName}.${String(e.className).slice(0, 60)}` : "nada";
      },
      [selector, box.x + box.width / 2, box.y + box.height / 2],
    );
    if (cover) throw new Error(`tapado por ${cover}`);
    out.label = (await cta.innerText()).replace(/\s+/g, " ").trim().slice(0, 50);
    await cta.tap({ timeout: 5000 });
    for (let i = 0; i < 20 && !hits.length; i++) await p.waitForTimeout(100);
    if (!hits.length) throw new Error("el toque no pidió /go/");
    if (!/[?&]j=1(&|$)/.test(hits[0])) throw new Error(`sin j=1: ${hits[0]}`);
    out.ok = true;
    out.why = hits[0].replace(/^https?:\/\/[^/]+/, "").slice(0, 90);
  } catch (e) {
    out.why = e.message.split("\n")[0].slice(0, 140);
  }
  await ctx.close();
  return out;
}

const ONLY = process.env.ONLY?.split(","); // p. ej. ONLY=botas,guantes
const pages = [
  ["home", "/es", '[data-testid="deal-go"]'],
  ["camiseta", `/es/camiseta/${JERSEY}`, BAR],
  ["botas", ONLY && !ONLY.includes("botas") ? "" : process.env.BOTA ? `/es/botas/${process.env.BOTA}` : await firstFicha("botas"), BAR],
  ["guantes", ONLY && !ONLY.includes("guantes") ? "" : process.env.GUANTE ? `/es/guantes/${process.env.GUANTE}` : await firstFicha("guantes"), BAR],
];
const results = [];
for (const [name, path, sel] of pages.filter(([n]) => !ONLY || ONLY.includes(n))) for (const reject of [false, true]) results.push(await check(name, path, sel, reject));
await browser.close();

for (const r of results) console.log(`${r.ok ? "OK  " : "FALLO"} ${r.name.padEnd(9)} ${r.state.padEnd(13)} ${r.path}\n      ${r.label ?? ""}  ${r.why}`);
const bad = results.filter((r) => !r.ok).length;
console.log(bad ? `\n${bad} de ${results.length} fallan` : `\n${results.length}/${results.length} OK`);
process.exit(bad ? 1 : 0);
