#!/usr/bin/env node
// Resumen semanal de clics a tienda para el dueño, por ntfy/Telegram
// (notify.mjs). Crontab de la Mini PC (TZ=Europe/Madrid): lunes 9:00.
//
//   node scripts/ops/weekly_clicks.mjs            # últimos 7 días completos vs los 7 anteriores, y envía
//   node scripts/ops/weekly_clicks.mjs --dry      # solo imprime
//   node scripts/ops/weekly_clicks.mjs --hasta 2026-10-19   # semana que termina el día anterior a esa fecha
//
// Persona = el enlace lo tocó un puntero/clic en la página (j=1, ver
// src/lib/go.ts) y /go/ no la clasificó como robot (h !== false). Todo lo
// demás cuenta como robot: el 99 % del registro son ráfagas automáticas
// (análisis 2026-10-09), así que "clics" sin filtrar no dicen nada.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DIR = process.env.CLICK_LOG_DIR || "/home/piojo/fc-data/clicks";
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const DAY = 86_400_000;
const hastaArg = args[args.indexOf("--hasta") + 1];
const end = args.includes("--hasta") ? Date.parse(`${hastaArg}T00:00:00Z`) : Math.floor(Date.now() / DAY) * DAY;
if (!Number.isFinite(end)) {
  console.error("--hasta YYYY-MM-DD");
  process.exit(2);
}
const weeks = [
  [end - 7 * DAY, end],
  [end - 14 * DAY, end - 7 * DAY],
];
const SECTION = { j: "camiseta", b: "botas", g: "guantes", p: "pelotas", a: "ropa", e: "entrenamiento", t: "tickets" };

const months = new Set();
for (let t = weeks[1][0]; t < end; t += DAY) months.add(new Date(t).toISOString().slice(0, 7));
const rows = [];
for (const m of months) {
  const f = path.join(DIR, `${m}.jsonl`);
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    if (!line) continue;
    try {
      rows.push(JSON.parse(line));
    } catch {}
  }
}

const isHuman = (r) => r.j === true && r.h !== false;
function stats([from, to]) {
  const rs = rows.filter((r) => {
    const t = Date.parse(r.t);
    return t >= from && t < to;
  });
  const humans = rs.filter(isHuman);
  const count = (list, key) => {
    const m = new Map();
    for (const r of list) {
      const k = key(r);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m].sort((a, b) => b[1] - a[1]);
  };
  return {
    total: rs.length,
    humans: humans.length,
    bots: rs.length - humans.length,
    dead: humans.filter((r) => !r.ok).length,
    botWhy: count(rs.filter((r) => !isHuman(r)), (r) => r.bot ?? (r.j ? "?" : "sin-j")),
    bySection: count(humans, (r) => SECTION[r.k] ?? r.k),
    byStore: count(humans, (r) => r.s ?? "?"),
    byLocale: count(humans, (r) => r.l ?? "?"),
    byOrigin: count(humans, (r) => r.o ?? "?"),
    top: count(humans, (r) => `${SECTION[r.k] ?? r.k}/${r.p}`),
  };
}

const [cur, prev] = weeks.map(stats);
const day = (t) => new Date(t).toISOString().slice(5, 10);
const delta = (a, b) => (b === 0 ? (a === 0 ? "=" : "nuevo") : `${a >= b ? "+" : ""}${Math.round(((a - b) / b) * 100)} %`);
const list = (pairs, n = 6) => (pairs.length ? pairs.slice(0, n).map(([k, v]) => `${k} ${v}`).join(", ") : "—");

const title = `Clics a tienda ${day(weeks[0][0])}→${day(weeks[0][1] - DAY)}: ${cur.humans} personas`;
const msg = [
  `Personas (j=1): ${cur.humans} (semana anterior ${prev.humans}, ${delta(cur.humans, prev.humans)})${cur.dead ? ` · ${cur.dead} sin destino` : ""}`,
  `Robots filtrados: ${cur.bots} de ${cur.total} (anterior ${prev.bots} de ${prev.total}) · ${list(cur.botWhy, 5)}`,
  `Por sección: ${list(cur.bySection)}`,
  `Por tienda: ${list(cur.byStore)}`,
  `Por idioma: ${list(cur.byLocale)}`,
  `Por origen: ${list(cur.byOrigin)}`,
  `Top fichas: ${list(cur.top, 5)}`,
].join("\n");

console.log(`${title}\n${msg}`);
if (DRY) process.exit(0);
const r = spawnSync(process.execPath, [path.join(import.meta.dirname, "notify.mjs"), title, msg], { stdio: "inherit" });
process.exit(r.status ?? 1);
