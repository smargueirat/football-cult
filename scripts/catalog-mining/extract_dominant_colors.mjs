#!/usr/bin/env node
// Extrae el color dominante REAL de la foto de cada producto (no el color
// "de marca" del equipo que hoy vive en colorHex/colorHexSecondary -- ese
// es un valor por EQUIPO, compartido por todas sus camisetas sea cual sea
// el diseño real de cada una, así que filtrar por color usando colorHex
// devuelve resultados incorrectos: filtrar "rojo" trae también la
// camiseta gris de entrenamiento o la verde alternativa de un equipo cuyo
// color de marca es rojo). Este script mira la FOTO real de cada oferta y
// bucketea el color dominante de la prenda (ignorando fondo blanco/gris
// claro), guardando el resultado en un archivo aparte para no tocar
// colorHex (que se sigue usando para el ícono/gradiente de fallback).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const PRODUCTS_PATH = path.join(REPO_ROOT, "src/data/products.ts");
const OUT_PATH = path.join(REPO_ROOT, "src/data/productDominantColors.json");

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

// Bucketea cada pixel de la prenda (ignorando fondo) y devuelve el color
// dominante + una muestra de conteos, para poder inspeccionar calidad.
//
// Las fotos de eBay (una buena parte del catálogo, sobre todo retro) NO
// son de estudio -- son fotos caseras del vendedor sobre mesada de granito,
// una manta con estampado, el piso de un dormitorio, etc. Un fondo así no
// es blanco/gris clarito (el filtro de "fondo" de abajo no lo agarra) y
// domina el conteo de píxeles, arruinando la clasificación (ej. una
// camiseta blanca terminaba "gris" por la mesada de atrás). La prenda
// casi siempre está centrada en el cuadro aunque el fondo sea un desastre,
// así que recortamos al 55% central antes de contar -- reduce mucho el
// ruido de fondo sin depender de que sea blanco.
async function dominantColorForImage(url) {
  const res = await fetch(thumbUrl(url, 64), {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const resized = sharp(buf).resize(56, 56, { fit: "inside" });
  const full = await resized.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = full.info.width;
  const h = full.info.height;
  const ch = full.info.channels;

  // Estima el color de fondo mirando el borde (anillo de 2px) en vez de
  // asumir que es blanco -- las fotos de eBay suelen tener fondos caseros
  // (mesada, manta, piso) de cualquier color/textura, no un estudio.
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

  const BG_DIST = 55; // distancia euclídea en RGB (0-255) para "es fondo"
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue; // transparente -> no es parte de la foto
    total++;
    if (bgAvg) {
      const d = Math.sqrt((r - bgAvg.r) ** 2 + (g - bgAvg.g) ** 2 + (b - bgAvg.b) ** 2);
      if (d < BG_DIST) {
        backgroundish++;
        continue;
      }
    }
    const { h: hh, s, l } = hexToHsl(r, g, b);
    // Además del fondo estimado por borde, seguimos excluyendo blanco/gris
    // clarito puro (fondo de estudio limpio que a veces el borde no capta
    // del todo bien).
    if (l > 0.9 && s < 0.1) {
      backgroundish++;
      continue;
    }
    sumL += l;
    sumS += s;
    fgN++;
    counts[classify(hh, s, l)]++;
  }

  // Una prenda blanca fotografiada con luz normal (no estudio) casi nunca
  // pega píxeles con l>0.92 salvo en el brillo -- la mayoría cae en
  // "gris" según el umbral estricto de classify(), aunque a simple vista
  // sea blanca. Por eso, para el caso acromático (saturación baja en
  // promedio), decidimos por la LUMINOSIDAD PROMEDIO de toda la prenda en
  // vez de por el voto pixel a pixel -- mucho más robusto a sombras y
  // arrugas. Para prendas con color sí confiamos en el voto por pixel
  // (evita que promediar rojo+blanco dé un "rosa" que no representa nada).
  if (fgN > 0) {
    const avgL = sumL / fgN;
    const avgS = sumS / fgN;
    if (avgS < 0.18) {
      const achromatic = avgL > 0.68 ? "white" : avgL < 0.22 ? "black" : "gray";
      return { color: achromatic, counts, total, backgroundish, avgL, avgS, achromaticOverride: true };
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

  // Si casi todo el recorte central quedó marcado como "fondo" (garantía
  // insuficiente de prenda visible -- logo chiquito, o de verdad una
  // prenda blanca/clara indistinguible del fondo por color), no confiamos
  // en el ganador por conteo de pixeles sueltos: clasificamos el promedio
  // del recorte completo (sin filtrar), que para una prenda clara cae
  // bien en "white" por el propio umbral de luminosidad de classify().
  if (bestCount === 0 || backgroundish / total > 0.85) {
    let sr = 0, sg = 0, sb = 0, sn = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      if (data[i + 3] < 128) continue;
      sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; sn++;
    }
    if (sn > 0) {
      const { h: hh, s, l } = hexToHsl(sr / sn, sg / sn, sb / sn);
      return { color: classify(hh, s, l), counts, total, backgroundish, fallback: true };
    }
  }

  return { color: best, counts, total, backgroundish };
}

function extractProductImagePairs(src, limitIds) {
  const idRe = /^ {2,4}id: "([^"]+)",$/gm;
  const matches = [];
  let m;
  while ((m = idRe.exec(src))) matches.push({ id: m[1], index: m.index });

  const pairs = [];
  for (let i = 0; i < matches.length; i++) {
    const { id, index } = matches[i];
    if (limitIds && !limitIds.has(id)) continue;
    const end = i + 1 < matches.length ? matches[i + 1].index : src.length;
    const block = src.slice(index, end);
    // Preferimos una foto que NO sea de eBay: son fotos de estudio con
    // fondo limpio (blanco/transparente), mucho más confiables para sacar
    // el color dominante que las fotos caseras de un vendedor de eBay.
    // Recién si el producto no tiene ninguna otra oferta con foto,
    // caemos a la de eBay (con el recorto central de arriba para
    // compensar el fondo ruidoso).
    const offerLines = block.match(/\{ store: "[^"]*"[^\n]*imageUrl: "[^"]+"[^\n]*\}/g) ?? [];
    let chosen = null;
    for (const line of offerLines) {
      const storeMatch = line.match(/store: "([^"]*)"/);
      const imgMatch = line.match(/imageUrl: "([^"]+)"/);
      if (!imgMatch) continue;
      if (storeMatch && storeMatch[1] !== "eBay") {
        chosen = imgMatch[1];
        break;
      }
      if (!chosen) chosen = imgMatch[1];
    }
    if (chosen) pairs.push({ id, imageUrl: chosen });
  }
  return pairs;
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
  const args = process.argv.slice(2);
  const sampleFlagIdx = args.indexOf("--sample");
  const sampleSize = sampleFlagIdx >= 0 ? parseInt(args[sampleFlagIdx + 1], 10) : null;

  const src = fs.readFileSync(PRODUCTS_PATH, "utf8");
  let pairs = extractProductImagePairs(src, null);
  console.error(`products with an image: ${pairs.length}`);

  if (sampleSize) {
    // Muestra dispersa (no las primeras N, para cubrir variedad de
    // equipos/tipos) tomando 1 de cada K.
    const step = Math.max(1, Math.floor(pairs.length / sampleSize));
    pairs = pairs.filter((_, i) => i % step === 0).slice(0, sampleSize);
  }

  let done = 0;
  const results = await mapWithConcurrency(pairs, 16, async (p) => {
    const r = await dominantColorForImage(p.imageUrl);
    done++;
    if (done % 200 === 0) console.error(`${done}/${pairs.length}`);
    return { id: p.id, imageUrl: p.imageUrl, ...r };
  });

  const out = {};
  let errors = 0;
  for (const r of results) {
    if (!r || r.error || !r.color) {
      errors++;
      continue;
    }
    out[r.id] = r.color;
  }
  console.error(`ok: ${Object.keys(out).length}, errors: ${errors}`);

  if (sampleSize) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 0));
    console.error(`wrote ${OUT_PATH}`);
  }
}

main();
