// Ofertas muertas entre las más clicadas.  node scripts/check_dead_offers.mjs [--top 50] [--dir data/clicks] [--month 2026-10]
//
// Lee los JSONL que escribe /go/ (src/lib/clickLog.ts), se queda con los
// destinos más clicados (sin bots) y los pide: HEAD y, si el comercio no
// lo acepta, GET. Sigue los redirects del enlace de afiliado hasta la
// página final. NO está en el cron nocturno: se corre a mano.
//
// Alcance honesto: detecta 404/410, errores de servidor y caídas. No
// detecta "soft 404" (el comercio devuelve 200 con "producto no
// disponible") ni distingue stock; un 403/429 es el comercio bloqueando
// a este script, no una oferta muerta.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const dir = arg("dir", process.env.CLICK_LOG_DIR || path.join(process.cwd(), "data", "clicks"));
const top = Number(arg("top", "50"));
const month = arg("month", "");

let files;
try {
  files = readdirSync(dir).filter((f) => f.endsWith(".jsonl") && f.startsWith(month)).sort();
} catch {
  console.error(`No existe ${dir}: todavía no hay clics registrados.`);
  process.exit(0);
}

const byUrl = new Map();
let total = 0, bots = 0, unresolved = 0;
for (const f of files) {
  for (const line of readFileSync(path.join(dir, f), "utf8").split("\n")) {
    if (!line) continue;
    let r;
    try { r = JSON.parse(line); } catch { continue; }
    total++;
    if (r.ua === "bot" || r.h === false) { bots++; continue; }
    if (!r.ok || !r.u) { unresolved++; continue; }
    const e = byUrl.get(r.u) ?? { clicks: 0, store: r.s, product: r.p, kind: r.k };
    e.clicks++;
    byUrl.set(r.u, e);
  }
}
const ranked = [...byUrl.entries()].sort((a, b) => b[1].clicks - a[1].clicks).slice(0, top);
console.log(`${total} clics en ${files.length} archivo(s): ${bots} de bots, ${unresolved} sin resolver, ${byUrl.size} destinos distintos. Reviso los ${ranked.length} más clicados.\n`);

async function probe(url) {
  const opts = { redirect: "follow", signal: AbortSignal.timeout(20_000), headers: { "user-agent": "Mozilla/5.0 (compatible; FootballCultLinkCheck/1.0)" } };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if ([400, 403, 404, 405, 501].includes(res.status)) res = await fetch(url, { ...opts, method: "GET" });
    return { status: res.status, final: res.url };
  } catch (err) {
    return { status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

const verdict = (s) =>
  s === 404 || s === 410 ? "MUERTA" : s === 0 || s >= 500 ? "ERROR" : s === 403 || s === 429 ? "bloqueada" : s >= 200 && s < 400 ? "ok" : `HTTP ${s}`;

const results = [];
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < ranked.length) {
    const [url, info] = ranked[next++];
    results.push({ url, ...info, ...(await probe(url)) });
  }
}));

results.sort((a, b) => b.clicks - a.clicks);
for (const r of results) {
  console.log(`${verdict(r.status).padEnd(9)} ${String(r.status || "-").padEnd(4)} ${String(r.clicks).padStart(4)} clics  ${r.store ?? "?"}  [${r.kind}/${r.product}]\n          ${r.url}${r.error ? `\n          ${r.error}` : ""}`);
}
const dead = results.filter((r) => verdict(r.status) === "MUERTA");
const err = results.filter((r) => verdict(r.status) === "ERROR");
console.log(`\nResumen: ${dead.length} muertas (404/410), ${err.length} con error, ${results.filter((r) => verdict(r.status) === "bloqueada").length} bloqueadas (no concluyente), ${results.filter((r) => verdict(r.status) === "ok").length} ok.`);
