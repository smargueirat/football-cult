// Importa UNA VEZ el historial previo al archivo durable (data/price-history).
//   npx tsx scripts/catalog-mining/seed_price_archive.mts
//
// Fuentes: src/data/priceHistory.json (ventana de 14 días, solo camisetas)
// y scripts/catalog-mining/price_snapshot.json (precio de hoy de las siete
// secciones). De la ventana se guardan solo los CAMBIOS, no los días
// repetidos. No pisa nada: si ya hay archivo, aborta.
import fs from "node:fs";
import path from "node:path";
import { ARCHIVE_DIR, SEED_DATE, offerKey } from "../../src/lib/priceArchive";

const ROOT = path.join(import.meta.dirname, "..", "..");
const history = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/priceHistory.json"), "utf-8"),
) as Record<string, { date: string; price: number }[]>;
const snapshot = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "price_snapshot.json"), "utf-8"),
) as Record<string, { price: number; currency: string }>;

if (fs.existsSync(ARCHIVE_DIR) && fs.readdirSync(ARCHIVE_DIR).some((f) => f.endsWith(".jsonl"))) {
  console.error("data/price-history ya tiene archivos: no se pisa. Borralos a mano si es a propósito.");
  process.exit(1);
}

const lines: [string, string, number, string][] = [];
const seen = new Map<string, string>();
const put = (url: string, date: string, price: number, currency: string) => {
  const k = offerKey(url);
  const o = seen.get(k);
  if (o && o !== url) throw new Error(`colisión ${k}: ${o} / ${url}`);
  seen.set(k, url);
  lines.push([date, k, price, currency]);
};

let fromHistory = 0;
const covered = new Set<string>();
for (const [url, days] of Object.entries(history)) {
  const snap = snapshot[url];
  if (!snap) continue; // oferta que ya no está en el catálogo: sin moneda confiable
  covered.add(url);
  let last = -1;
  for (const d of [...days].sort((a, b) => a.date.localeCompare(b.date))) {
    if (d.price === last) continue;
    put(url, d.date, d.price, snap.currency);
    last = d.price;
    fromHistory++;
  }
  // El snapshot es el precio de hoy: si difiere del último día de la
  // ventana, hubo un cambio hoy.
  if (last !== snap.price) {
    put(url, SEED_DATE, snap.price, snap.currency);
    fromHistory++;
  }
}
let fromSnapshot = 0;
for (const [url, v] of Object.entries(snapshot)) {
  if (covered.has(url) || !(v.price > 0)) continue;
  put(url, SEED_DATE, v.price, v.currency);
  fromSnapshot++;
}

lines.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
const byMonth = new Map<string, string[]>();
for (const l of lines) {
  const m = l[0].slice(0, 7);
  byMonth.set(m, [...(byMonth.get(m) ?? []), JSON.stringify(l)]);
}
for (const [m, ls] of byMonth) fs.writeFileSync(path.join(ARCHIVE_DIR, `${m}.jsonl`), ls.join("\n") + "\n");
console.log(`sembrado: ${fromHistory} líneas de la ventana (camisetas), ${fromSnapshot} del snapshot; ${seen.size} ofertas`);
