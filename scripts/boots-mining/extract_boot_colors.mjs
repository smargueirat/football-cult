#!/usr/bin/env node
// Mismo pipeline de análisis de píxel real ya probado con el catálogo de
// camisetas (scripts/catalog-mining/extract_dominant_colors.mjs), para
// las fotos reales de botas. Incremental: solo procesa ids que todavía
// no están en bootDominantColors.json -- corre todas las noches vía el
// scan diario, así que sólo hace falta fetchear las fotos de productos
// realmente nuevos, no repetir el catálogo entero cada vez.
//
// Lee boot_image_pairs.json ({id, imageUrl}[], generado por
// refresh_boots.py a partir del boots.ts recién ensamblado) y fusiona el
// resultado en el JSON existente (nunca borra un id viejo, aunque haya
// desaparecido del mine de hoy -- dato inofensivo sin usar, no vale la
// pena perseguirlo).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "/home/piojo/football-cult/node_modules/sharp/lib/index.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PAIRS_PATH = path.join(SCRIPT_DIR, "boot_image_pairs.json");
const OUT_PATH = path.join(SCRIPT_DIR, "..", "..", "src", "data", "bootDominantColors.json");

const ALREADY_SMALL_HOSTS = ["i.ebayimg.com", "images2.productserve.com"];

function thumbUrl(url, width) {
  if (ALREADY_SMALL_HOSTS.some((h) => url.includes(`://${h}/`))) return url;
  if (url.includes("://cdn.shopify.com/")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}width=${width}`;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=png`;
}

function hexToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    default:
      h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

const COLOR_ORDER = [
  "black", "white", "gray", "red", "orange", "yellow",
  "green", "teal", "blue", "navy", "purple", "pink",
];

function classify(h, s, l) {
  if (l > 0.92) return "white";
  if (l < 0.13) return "black";
  if (s < 0.15) return "gray";
  if (h >= 185 && h < 255) return l < 0.32 ? "navy" : "blue";
  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 65) return "yellow";
  if (h < 160) return "green";
  if (h < 185) return "teal";
  if (h < 290) return "purple";
  return "pink";
}

async function dominantColorForImage(url) {
  const res = await fetch(thumbUrl(url, 64), { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const resized = sharp(buf).resize(56, 56, { fit: "inside" });
  const full = await resized.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = full.info.width;
  const h = full.info.height;
  const ch = full.info.channels;

  let bgR = 0, bgG = 0, bgB = 0, bgN = 0;
  const px = (x, y) => {
    const i = (y * w + x) * ch;
    return { r: full.data[i], g: full.data[i + 1], b: full.data[i + 2], a: full.data[i + 3] };
  };
  for (let x = 0; x < w; x++) {
    for (const y of [0, 1, h - 2, h - 1]) {
      if (y < 0 || y >= h) continue;
      const p = px(x, y);
      if (p.a < 128) continue;
      bgR += p.r; bgG += p.g; bgB += p.b; bgN++;
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, 1, w - 2, w - 1]) {
      if (x < 0 || x >= w) continue;
      const p = px(x, y);
      if (p.a < 128) continue;
      bgR += p.r; bgG += p.g; bgB += p.b; bgN++;
    }
  }
  const bgAvg = bgN > 0 ? { r: bgR / bgN, g: bgG / bgN, b: bgB / bgN } : null;

  const cropW = Math.max(1, Math.round(w * 0.55));
  const cropH = Math.max(1, Math.round(h * 0.55));
  const left = Math.floor((w - cropW) / 2);
  const top = Math.floor((h - cropH) / 2);
  const { data, info } = await resized
    .clone()
    .extract({ left, top, width: cropW, height: cropH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const counts = {};
  for (const k of COLOR_ORDER) counts[k] = 0;
  let backgroundish = 0;
  let total = 0;
  let sumL = 0;
  let sumS = 0;
  let fgN = 0;

  const BG_DIST = 55;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;
    total++;
    if (bgAvg) {
      const d = Math.sqrt((r - bgAvg.r) ** 2 + (g - bgAvg.g) ** 2 + (b - bgAvg.b) ** 2);
      if (d < BG_DIST) {
        backgroundish++;
        continue;
      }
    }
    const { h: hh, s, l } = hexToHsl(r, g, b);
    if (l > 0.9 && s < 0.1) {
      backgroundish++;
      continue;
    }
    sumL += l;
    sumS += s;
    fgN++;
    counts[classify(hh, s, l)]++;
  }

  if (fgN > 0) {
    const avgL = sumL / fgN;
    const avgS = sumS / fgN;
    if (avgS < 0.18) {
      const achromatic = avgL > 0.68 ? "white" : avgL < 0.22 ? "black" : "gray";
      return { color: achromatic, achromaticOverride: true };
    }
  }

  if (total === 0) return null;

  let best = null;
  let bestCount = -1;
  for (const k of COLOR_ORDER) {
    if (counts[k] > bestCount) {
      best = k;
      bestCount = counts[k];
    }
  }

  if (bestCount === 0 || backgroundish / total > 0.85) {
    let sr = 0, sg = 0, sb = 0, sn = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      if (data[i + 3] < 128) continue;
      sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; sn++;
    }
    if (sn > 0) {
      const { h: hh, s, l } = hexToHsl(sr / sn, sg / sn, sb / sn);
      return { color: classify(hh, s, l), fallback: true };
    }
  }

  return { color: best };
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try {
        results[i] = await fn(items[i], i);
      } catch (err) {
        results[i] = { error: String(err) };
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  const pairs = JSON.parse(fs.readFileSync(PAIRS_PATH, "utf8"));
  const existing = fs.existsSync(OUT_PATH) ? JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) : {};
  const missing = pairs.filter((p) => !(p.id in existing));
  console.error(`boots with an image: ${pairs.length}, already classified: ${pairs.length - missing.length}, new to fetch: ${missing.length}`);

  if (missing.length === 0) {
    console.error("nothing new, leaving bootDominantColors.json untouched");
    return;
  }

  let done = 0;
  const results = await mapWithConcurrency(missing, 16, async (p) => {
    const r = await dominantColorForImage(p.imageUrl);
    done++;
    if (done % 200 === 0) console.error(`${done}/${missing.length}`);
    return { id: p.id, ...r };
  });

  let errors = 0;
  for (const r of results) {
    if (!r || r.error || !r.color) {
      errors++;
      continue;
    }
    existing[r.id] = r.color;
  }
  console.error(`ok: ${missing.length - errors}, errors: ${errors}`);
  fs.writeFileSync(OUT_PATH, JSON.stringify(existing, null, 0));
  console.error(`wrote ${OUT_PATH}`);
}

main();
