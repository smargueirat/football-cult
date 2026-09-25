// Publicador de bajadas de precio a un canal de Telegram.
//
//   npx tsx scripts/catalog-mining/broadcast_price_drops.mts          # ensayo, no publica
//   TELEGRAM_BOT_TOKEN=... TELEGRAM_CHANNEL_ID=@micanal npx tsx ...   # publica de verdad
//
// Corre DESPUÉS de track_price_drops.mts, como último paso del escaneo
// nocturno: lee src/data/priceDrops.json, elige las mejores bajadas y las
// publica.
//
// Por qué existe: el sitio no recibe visitas de búsqueda orgánica (0
// sesiones en GA4) y Google indexa 4.098 de ~51.000 URLs porque no
// tenemos enlaces entrantes. Un canal de chollos no necesita autoridad de
// dominio ni esperar seis meses, y el dato que lo alimenta ya se calcula
// todas las noches. Es la única palanca de audiencia que no depende de
// nadie más.
//
// Se enlaza NUESTRA ficha, no el link de afiliado directo. Por dos
// razones, y las dos importan: varios programas de Awin prohíben publicar
// sus deep links fuera del sitio aprobado, y la ficha es la que muestra la
// comparación completa (de ahí pueden salir varios clics, no uno).
import fs from "node:fs";
import path from "node:path";
import { products, teamNames, typeNames } from "../../src/data/products";
import { bootProducts } from "../../src/data/boots";
import { ticketProducts } from "../../src/data/tickets";
import { apparelProducts } from "../../src/data/apparel";
import { gloveProducts } from "../../src/data/gloves";
import { ballProducts } from "../../src/data/balls";
import { trainingProducts } from "../../src/data/training";
import { previousPriceOf, priceDropPercent } from "../../src/lib/priceDrops";
import { commissionRate } from "../../src/lib/commissionRates";

const HERE = import.meta.dirname;
const STATE_PATH = path.join(HERE, "telegram_posted.json");
const SITE = "https://football-cult.com/es";

/** Cuántas bajadas se publican por corrida. */
const PER_RUN = 3;
/** Mínimo para que valga la pena molestar a un suscriptor. */
const MIN_DROP_PCT = 10;
/** Días que se recuerda una bajada ya publicada, para no repetirla. */
const STATE_DAYS = 30;

// Solo para ordenar entre monedas, no para mostrar importes convertidos:
// cada mensaje muestra el precio en la moneda real de la tienda.
const TO_EUR: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  BRL: 0.17,
  CLP: 0.001,
  ARS: 0.0008,
};

interface Candidate {
  key: string;
  section: string;
  title: string;
  url: string;
  imageUrl?: string;
  store: string;
  price: number;
  previousPrice: number;
  currency: string;
  dropPct: number;
  /** Descuento por comisión esperada: una bota al 30% vale mucho más que un cono al 30%. */
  score: number;
}

function jerseyTitle(p: (typeof products)[number]): string {
  const team = teamNames[p.teamKey]?.es ?? p.teamKey;
  const kind = typeNames[p.typeKey]?.es ?? "";
  return `Camiseta ${team} ${p.season} ${kind}`.replace(/\s+/g, " ").trim();
}

function collect(): Candidate[] {
  const out: Candidate[] = [];

  const push = (
    section: string,
    routeBase: string,
    id: string,
    title: string,
    offers: readonly { store: string; price: number; currency: string; url: string; imageUrl?: string; inStock?: boolean }[],
    // Las entradas traen la foto en el producto, no en la oferta.
    fallbackImage?: string
  ) => {
    for (const o of offers) {
      // inStock solo cuenta cuando la sección lo trae: en varias el feed
      // no da disponibilidad fiable y forzar el filtro las dejaría fuera.
      if (o.inStock === false) continue;
      const prev = previousPriceOf(o);
      if (prev === undefined) continue;
      const pct = priceDropPercent(o);
      if (pct < MIN_DROP_PCT) continue;
      const rate = commissionRate(o.store);
      // Una tienda sin programa de afiliado no paga el clic: no se
      // promociona, aunque la bajada sea espectacular.
      if (rate <= 0) continue;
      const eur = (o.price * (TO_EUR[o.currency] ?? 1)) * rate;
      out.push({
        key: `${o.url}|${prev}`,
        section,
        title,
        url: `${SITE}/${routeBase}/${id}`,
        imageUrl: telegramPhoto(o.imageUrl ?? fallbackImage),
        store: o.store,
        price: o.price,
        previousPrice: prev,
        currency: o.currency,
        dropPct: pct,
        score: pct * eur,
      });
    }
  };

  for (const p of products) push("camisetas", "camiseta", p.id, jerseyTitle(p), p.offers);
  for (const b of bootProducts) push("botas", "botas", b.id, `${b.brand} ${b.model}`, b.offers);
  for (const t of ticketProducts)
    push("entradas", "tickets", t.id, ticketTitle(t), t.offers, t.imageUrl);
  for (const a of apparelProducts) push("ropa", "ropa", a.id, `${a.brand} ${a.model}`, a.offers);
  for (const g of gloveProducts) push("guantes", "guantes", g.id, `${g.brand} ${g.model}`, g.offers);
  for (const b of ballProducts) push("pelotas", "pelotas", b.id, `${b.brand} ${b.model}`, b.offers);
  for (const t of trainingProducts) push("entrenamiento", "entrenamiento", t.id, `${t.brand} ${t.model}`, t.offers);

  return out;
}

function ticketTitle(t: (typeof ticketProducts)[number]): string {
  // `event` ya viene como "Local vs Visitante"; la fecha la agrega el
  // mensaje porque una entrada sin fecha no dice nada.
  return `${t.event} · ${t.date}`;
}

// La foto que se publica NO es siempre la que guarda el catálogo.
//
// Las ofertas de Awin traen la imagen a través de images2.productserve.com,
// que sirve un thumbnail de 200x200 y 5 KB: en el sitio alcanza (la card
// es chica y weserv la cachea), pero en Telegram, que la muestra a ancho
// completo, se ve borrosa. Dentro de esa URL viaja, en el parámetro `url`,
// la foto original del comercio -- la misma de adidas a 1080x1080 y 54 KB.
// Se desenvuelve solo para publicar; el sitio sigue usando lo de siempre.
//
// El prefijo `ssl:` es la forma que tiene productserve de marcar https.
function broadcastImage(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!url.includes("productserve.com")) return url;
  const inner = new URL(url).searchParams.get("url");
  if (!inner) return url;
  const full = inner.replace(/^ssl:/, "https://").replace(/^http:/, "https:");
  return /^https:\/\//.test(full) ? full : url;
}

// Todo lo que se publica pasa por weserv (el mismo proxy que ya usa el
// sitio, ver src/lib/images.ts) forzando JPEG a 1280 px. Dos motivos: hay
// tiendas que sirven .webp (cdn.blazimg.com) y sendPhoto no lo trata como
// foto normal, y así ninguna imagen se pasa de los límites de Telegram sin
// tener que comprobar el tamaño de cada una.
function telegramPhoto(url: string | undefined): string | undefined {
  const full = broadcastImage(url);
  if (!full) return undefined;
  return `https://images.weserv.nl/?url=${encodeURIComponent(full)}&w=1280&output=jpg`;
}

function money(amount: number, currency: string): string {
  const symbol: Record<string, string> = { EUR: "€", USD: "US$", GBP: "£", BRL: "R$", CLP: "$", ARS: "$" };
  // Sin toLocaleString: este Node corre con ICU reducido (solo en-GB) y
  // toLocaleString("es") descarta los separadores en silencio -- bug ya
  // encontrado en trustStrip.ts.
  const body = amount.toFixed(2).replace(".", ",");
  return `${symbol[currency] ?? currency + " "}${body}`;
}

const EMOJI: Record<string, string> = {
  camisetas: "👕",
  botas: "👟",
  entradas: "🎟️",
  ropa: "🧥",
  guantes: "🧤",
  pelotas: "⚽",
  entrenamiento: "🎯",
};

function caption(c: Candidate): string {
  return [
    `${EMOJI[c.section] ?? "⚽"} <b>${escapeHtml(c.title)}</b>`,
    ``,
    `<s>${money(c.previousPrice, c.currency)}</s> → <b>${money(c.price, c.currency)}</b> (-${c.dropPct}%)`,
    `en ${escapeHtml(c.store)}`,
    ``,
    `👉 ${c.url}`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface State {
  [key: string]: string; // key -> fecha ISO de publicación
}

async function send(token: string, chat: string, c: Candidate): Promise<void> {
  const base = `https://api.telegram.org/bot${token}`;
  const body = c.imageUrl
    ? { chat_id: chat, photo: c.imageUrl, caption: caption(c), parse_mode: "HTML" }
    : { chat_id: chat, text: caption(c), parse_mode: "HTML" };
  const res = await fetch(`${base}/${c.imageUrl ? "sendPhoto" : "sendMessage"}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHANNEL_ID;
  const dryRun = !token || !chat;

  const state: State = fs.existsSync(STATE_PATH)
    ? JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"))
    : {};
  const cutoff = new Date(Date.now() - STATE_DAYS * 864e5).toISOString();
  for (const k of Object.keys(state)) if (state[k] < cutoff) delete state[k];

  const candidates = collect()
    .filter((c) => !state[c.key])
    .sort((a, b) => b.score - a.score);

  // Una sola bajada por producto por corrida: dos tiendas del mismo
  // producto en el canal es el mismo mensaje dos veces.
  const seen = new Set<string>();
  const picks: Candidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.url)) continue;
    seen.add(c.url);
    picks.push(c);
    if (picks.length >= PER_RUN) break;
  }

  console.log(
    `${candidates.length} bajadas candidatas (>=${MIN_DROP_PCT}%, con afiliación, sin repetir), publico ${picks.length}`
  );

  for (const c of picks) {
    console.log(`\n--- ${c.section} · score ${c.score.toFixed(1)} ---\n${caption(c)}`);
    console.log(`[foto] ${c.imageUrl ?? "sin foto -- se publica como texto"}`);
    if (dryRun) continue;
    await send(token!, chat!, c);
    state[c.key] = new Date().toISOString();
    // El límite del Bot API es ~20 mensajes por minuto a un canal.
    await new Promise((r) => setTimeout(r, 3500));
  }

  if (dryRun) {
    console.log(
      "\nENSAYO: no se publicó nada. Faltan TELEGRAM_BOT_TOKEN y TELEGRAM_CHANNEL_ID (ver .env.local)."
    );
    return;
  }
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 1) + "\n");
  console.log(`\nPublicadas ${picks.length}. Estado: ${Object.keys(state).length} bajadas recordadas.`);
}

main();
