// Publicador de bajadas de precio a un canal de Telegram.
//
//   npx tsx scripts/catalog-mining/broadcast_price_drops.mts --dry-run   # ensayo, no publica nada
//   npx tsx scripts/catalog-mining/broadcast_price_drops.mts             # publica si hay credenciales
//
// Corre DESPUÉS de track_price_drops.mts, como último paso del escaneo
// nocturno: elige las mejores bajadas y las publica.
//
// Por qué existe: el sitio no recibe visitas de búsqueda orgánica y un canal
// de chollos no necesita autoridad de dominio. Pero un canal que publica
// basura pierde a sus suscriptores: hasta el 2026-10-09 el 89 % de lo
// publicado eran entradas de reventa con "bajadas" que eran ruido de
// cotización (una de £45.312 -> £24.723), porque la puntuación era
// % x precio x comisión, sin tope ni cuota. Ahora solo sale una bajada que
// se puede defender (ver qualifies()):
//   - el precio anterior lo vimos NOSOTROS (data/price-history) al menos
//     MIN_PREVIOUS_DAYS días seguidos, nunca el "precio tachado" del feed, y
//     el actual es el más bajo de los últimos 30 días (verifiedDrop);
//   - bajada >= MIN_DROP_PCT y >= MIN_DROP_EUR, precio <= MAX_EUR de su
//     sección, en stock, con envío a España (el canal es en español de
//     España) y como mucho MAX_DAYS_SINCE_DROP días desde la bajada;
//   - entradas: nunca un precio de plantilla (el mismo importe en decenas de
//     partidos), estable 2 corridas, partido futuro, y como mucho 1 de cada
//     TICKET_EVERY mensajes; primero camisetas, botas y equipamiento (QUOTA);
//   - ni un día en que la tienda bajó de golpe gran parte de la sección
//     (massDropDays: cambio del feed, como el paso de precio de lista a
//     precio de venta de Foot-Store FR el 2026-10-09);
//   - el mismo producto no se repite en REPEAT_DAYS días.
//
// Se enlaza NUESTRA ficha, no el link de afiliado directo: varios programas
// de Awin prohíben publicar sus deep links fuera del sitio aprobado, y la
// ficha muestra la comparación completa.
import fs from "node:fs";
import path from "node:path";
import { products, teamNames } from "../../src/data/products";
import { bootProducts } from "../../src/data/boots";
import { ticketProducts } from "../../src/data/tickets";
import { apparelProducts } from "../../src/data/apparel";
import { gloveProducts } from "../../src/data/gloves";
import { ballProducts } from "../../src/data/balls";
import { trainingProducts } from "../../src/data/training";
import { kitTypeName, offerShipsTo } from "../../src/lib/productMeta";
import { localizeGearModel } from "../../src/lib/gearText";
import { commissionRate } from "../../src/lib/commissionRates";
import { offerTotalInEUR, shippingUnknown, ticketTemplatePrices, type OfferCurrencyCode } from "../../src/lib/offerMoney";
import { loadArchive, massDropDays, verifiedDrop } from "../../src/lib/priceArchive";
import {
  dataDir,
  readFollowers,
  readJson,
  removeChat,
  writeJsonAtomic,
} from "../../src/lib/telegramFollowers";

const HERE = import.meta.dirname;
const REPO_ROOT = path.join(HERE, "..", "..");
const STATE_PATH = path.join(HERE, "telegram_posted.json");
const SITE = "https://football-cult.com/es";
const ARGS = process.argv.slice(2);
const FORCE_DRY_RUN = ARGS.includes("--dry-run") || process.env.DRY_RUN === "1";

// Las credenciales viven en .env.local (el cron no las exporta); exportarlas
// sigue ganando. Con --dry-run ni se leen ni se usan: un ensayo nunca publica.
if (FORCE_DRY_RUN) {
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHANNEL_ID;
} else {
  const envFile = path.join(REPO_ROOT, ".env.local");
  for (const line of fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf-8").split("\n") : []) {
    const m = /^(TELEGRAM_BOT_TOKEN|TELEGRAM_CHANNEL_ID)=(.+)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

/** Mensajes al canal por corrida (como máximo; con menos bajadas, menos). */
const PER_RUN = Number(ARGS[ARGS.indexOf("--max") + 1]) || 10;
/** Cuota por grupo dentro de PER_RUN; lo que sobre lo llenan los demás (nunca entradas). */
const QUOTA: Record<string, number> = { camisetas: 4, botas: 3, equipamiento: 3 };
/** Entradas: como mucho 1 de cada TICKET_EVERY mensajes publicados. */
const TICKET_EVERY = 10;
/** País del canal: envío y textos. */
const CHANNEL_COUNTRY = "ES";
/** Días que el precio anterior tuvo que estar vigente en nuestro archivo. */
const MIN_PREVIOUS_DAYS = 5;
const MIN_DROP_PCT = 15;
const MIN_DROP_EUR = 5;
/** Una bajada más vieja ya no es noticia. */
const MAX_DAYS_SINCE_DROP = 7;
/** Tope de cordura por sección, en EUR (por encima es un dato raro o reventa). */
const MAX_EUR: Record<string, number> = {
  camisetas: 250,
  botas: 350,
  ropa: 250,
  guantes: 150,
  pelotas: 200,
  entrenamiento: 150,
  entradas: 400,
};
/** El mismo producto no vuelve al canal en estos días. */
const REPEAT_DAYS = 14;
/** Máximo de mensajes privados por seguidor y corrida. */
const PER_FOLLOWER = 3;
/** Pausa entre envíos: el Bot API tolera ~30 msg/s en total, vamos a 10. */
const PAUSE_MS = 100;
/** Días que se recuerda lo publicado. */
const STATE_DAYS = 30;

const GROUP: Record<string, string> = {
  camisetas: "camisetas",
  botas: "botas",
  entradas: "entradas",
  ropa: "equipamiento",
  guantes: "equipamiento",
  pelotas: "equipamiento",
  entrenamiento: "equipamiento",
};

interface Candidate {
  /** Nuestra ficha: identifica el producto para no repetirlo. */
  key: string;
  section: string;
  title: string;
  url: string;
  imageUrl?: string;
  store: string;
  offerUrl: string;
  price: number;
  previousPrice: number;
  previousDays: number;
  currency: string;
  dropPct: number;
  /** Línea de envío a España (no aplica a entradas). */
  shippingLine?: string;
  /** Tiendas distintas en la ficha. */
  stores: number;
  /** Equipo de la camiseta (solo camisetas). */
  teamKey?: string;
  /** Bajada en EUR x comisión: lo que vale de verdad la bajada. */
  score: number;
}

type AnyOffer = {
  store: string;
  price: number;
  currency: string;
  url: string;
  shipping?: number;
  imageUrl?: string;
  inStock?: boolean;
};

const archive = loadArchive(path.join(REPO_ROOT, "data", "price-history"));
const templates = ticketTemplatePrices(ticketProducts);
// Días en que una tienda bajó de golpe gran parte de una sección: cambio del
// feed o de nuestra minería (precio de lista -> de venta), no una rebaja.
const MASS: Record<string, Set<string>> = Object.fromEntries(
  (
    [
      ["camisetas", products],
      ["botas", bootProducts],
      ["entradas", ticketProducts],
      ["ropa", apparelProducts],
      ["guantes", gloveProducts],
      ["pelotas", ballProducts],
      ["entrenamiento", trainingProducts],
    ] as const
  ).map(([s, list]) => [s, massDropDays((list as readonly { offers: readonly AnyOffer[] }[]).flatMap((p) => p.offers), archive)]),
);
const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

function toEUR(amount: number, currency: string): number {
  return offerTotalInEUR({ price: amount, shipping: 0, currency: currency as OfferCurrencyCode });
}

/** Por qué una oferta NO va al canal ({why}), o la bajada verificada si va. */
function qualifies(section: string, o: AnyOffer, eventDate?: string) {
  if (o.inStock === false) return { why: "sin stock" };
  // eBay: solo el marketplace español (las demás no siempre envían a España
  // y su envío/aduana es una incógnita).
  if (o.store.startsWith("eBay") ? o.store !== "eBay ES" : !offerShipsTo(o.store, CHANNEL_COUNTRY))
    return { why: "no envía a España" };
  if (commissionRate(o.store) <= 0) return { why: "sin afiliación" };
  const drop = verifiedDrop(o.url, o.price, o.currency, archive, MIN_PREVIOUS_DAYS);
  if (!drop) return { why: "sin bajada verificada" };
  const dropEUR = toEUR(drop.previous - o.price, o.currency);
  if (drop.pct < MIN_DROP_PCT || dropEUR < MIN_DROP_EUR) return { why: "bajada pequeña" };
  if (toEUR(o.price, o.currency) > (MAX_EUR[section] ?? 200)) return { why: "precio sobre el tope" };
  if (drop.daysAtCurrent > MAX_DAYS_SINCE_DROP) return { why: "bajada antigua" };
  if (MASS[section]?.has(`${o.store}|${drop.since}`)) return { why: "bajada masiva de la tienda (cambio del feed)" };
  if (section === "entradas") {
    if (templates.has(`${o.store}|${o.price}`) || templates.has(`${o.store}|${drop.previous}`))
      return { why: "precio de relleno" };
    if (drop.daysAtCurrent < 2) return { why: "entrada sin confirmar" };
    if (!eventDate || eventDate < tomorrow) return { why: "partido pasado" };
  }
  return { drop, dropEUR };
}

/** Descartes por motivo (solo de ofertas que sí tenían una bajada de algún tipo). */
const rejected = new Map<string, number>();

function collect(): Candidate[] {
  const out: Candidate[] = [];

  const push = (
    section: string,
    routeBase: string,
    id: string,
    title: string,
    offers: readonly AnyOffer[],
    // Las entradas traen la foto en el producto, no en la oferta.
    fallbackImage?: string,
    teamKey?: string,
    eventDate?: string,
  ) => {
    const stores = new Set(offers.map((o) => o.store)).size;
    for (const o of offers) {
      const q = qualifies(section, o, eventDate);
      if (!q.drop) {
        if (q.why !== "sin bajada verificada" && q.why !== "sin stock" && q.why !== "no envía a España" && q.why !== "sin afiliación")
          rejected.set(`${section}: ${q.why}`, (rejected.get(`${section}: ${q.why}`) ?? 0) + 1);
        continue;
      }
      const url = `${SITE}/${routeBase}/${id}`;
      out.push({
        key: url,
        section,
        title,
        url,
        imageUrl: telegramPhoto(o.imageUrl ?? fallbackImage),
        store: o.store,
        offerUrl: o.url,
        price: o.price,
        previousPrice: q.drop.previous,
        previousDays: q.drop.previousDays,
        currency: o.currency,
        dropPct: Math.round(q.drop.pct),
        shippingLine: section === "entradas" ? undefined : shippingLine(o),
        stores,
        teamKey,
        score: q.dropEUR * commissionRate(o.store),
      });
    }
  };

  for (const p of products)
    push(
      "camisetas",
      "camiseta",
      p.id,
      `Camiseta ${teamNames[p.teamKey]?.es ?? p.teamKey} ${p.season} ${kitTypeName(p, "es")}`,
      p.offers,
      undefined,
      p.teamKey,
    );
  for (const b of bootProducts) push("botas", "botas", b.id, named(b.brand, b.model, "Botas"), b.offers);
  for (const t of ticketProducts)
    push("entradas", "tickets", t.id, `Entradas ${t.event} · ${t.date.split("-").reverse().join("/")}`, t.offers, t.imageUrl, undefined, t.date);
  const gear = (section: string, list: readonly { id: string; brand: string; model: string; offers: readonly AnyOffer[] }[]) => {
    for (const g of list) push(section, section, g.id, named(g.brand, localizeGearModel(g.model, g.brand, "es")), g.offers);
  };
  gear("ropa", apparelProducts);
  gear("guantes", gloveProducts);
  gear("pelotas", ballProducts);
  gear("entrenamiento", trainingProducts);

  return out;
}

// El modelo de algunas tiendas ya trae "Botas de fútbol <marca> ...": no se
// antepone otra vez ni la marca ni el tipo.
function named(brand: string, model: string, kind = ""): string {
  const m = model.toLowerCase().includes(brand.toLowerCase()) ? model : `${brand} ${model}`;
  return kind && !m.toLowerCase().startsWith(kind.toLowerCase()) ? `${kind} ${m}` : m;
}

function shippingLine(o: AnyOffer): string {
  if (shippingUnknown({ store: o.store, shipping: o.shipping ?? 0, url: o.url }, CHANNEL_COUNTRY))
    return "Envío a España: a calcular en la tienda";
  return o.shipping ? `Envío a España: ${money(o.shipping, o.currency)}` : "Envío gratis a España";
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

const CURRENCY: Record<string, { symbol: string; name: string }> = {
  EUR: { symbol: "€", name: "" },
  USD: { symbol: "US$", name: "dólares" },
  GBP: { symbol: "£", name: "libras" },
  BRL: { symbol: "R$", name: "reales" },
  CLP: { symbol: "CLP", name: "pesos chilenos" },
  ARS: { symbol: "ARS", name: "pesos argentinos" },
};

// Formato de España: "1.234,56 €". Sin toLocaleString: este Node corre con
// ICU reducido (solo en-GB) y toLocaleString("es") descarta los separadores
// en silencio -- bug ya encontrado en trustStrip.ts.
function money(amount: number, currency: string): string {
  const [int, dec] = amount.toFixed(2).split(".");
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${dec} ${CURRENCY[currency]?.symbol ?? currency}`;
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
  const foreign = CURRENCY[c.currency]?.name;
  return [
    `${EMOJI[c.section] ?? "⚽"} <b>${escapeHtml(c.title)}</b>`,
    ``,
    `<b>${money(c.price, c.currency)}</b> en ${escapeHtml(c.store)} · antes <s>${money(c.previousPrice, c.currency)}</s> (−${c.dropPct} %)`,
    `Precio anterior visto ${c.previousDays} días seguidos en nuestro historial.`,
    ...(foreign ? [`Precio en ${foreign}, tal como lo cobra la tienda.`] : []),
    ...(c.shippingLine ? [c.shippingLine] : []),
    ``,
    `👉 ${c.stores > 1 ? `Compara ${c.stores} tiendas` : "Ver la oferta"}: ${c.url}`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface State {
  // ficha -> fecha ISO de publicación. Hasta el 2026-10-09 la clave era
  // "<url de la oferta>|<precio anterior>"; esas siguen contando para no
  // repetir hasta que caduquen.
  [key: string]: string;
}

class TelegramError extends Error {
  constructor(public status: number, public retryAfter: number | undefined, detail: string) {
    super(`Telegram ${status}: ${detail}`);
  }
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
  if (res.ok) return;
  const detail = (await res.text()).slice(0, 200);
  // Telegram baja la foto él mismo; si la tienda la quitó (404 detrás del
  // proxy, 2026-10-10 con una de ForumSport) va como texto en vez de cortar la tanda.
  if (c.imageUrl && res.status === 400 && /HTTP URL content|wrong type of the web page|IMAGE_PROCESS_FAILED/i.test(detail)) {
    return send(token, chat, { ...c, imageUrl: undefined });
  }
  throw new Error(`Telegram ${res.status}: ${detail}`);
}

// Mensaje privado a un seguidor: mismo texto y enlace a NUESTRA ficha que el
// canal, más una línea para darse de baja. Va como texto (no como foto): la
// vista previa del enlace ya muestra la imagen de la ficha, y un mensaje
// privado no puede fallar por una foto que Telegram rechace.
async function sendPrivate(token: string, chat: string, c: Candidate): Promise<void> {
  const text = `${caption(c)}\n\n<i>Sigues a ${escapeHtml(teamNames[c.teamKey as keyof typeof teamNames]?.es ?? c.teamKey ?? "")} · /stop para no recibir más avisos</i>`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    });
    if (res.ok) return;
    const detail = await res.text();
    let retryAfter: number | undefined;
    try {
      retryAfter = JSON.parse(detail)?.parameters?.retry_after;
    } catch {}
    // 429: Telegram dice cuánto esperar; se respeta una vez y se reintenta.
    if (res.status === 429 && attempt === 0 && retryAfter && retryAfter <= 60) {
      await new Promise((r) => setTimeout(r, retryAfter * 1000 + 200));
      continue;
    }
    throw new TelegramError(res.status, retryAfter, detail.slice(0, 200));
  }
}

// Avisos a seguidores. Aparte del canal: aquí NO valen las cuotas (que son
// para no inundar un canal público); cada seguidor recibe como máximo
// PER_FOLLOWER de las bajadas verificadas de los equipos que sigue.
// "Ya enviado" se recuerda por chat en el directorio de datos (fuera del repo,
// porque son ids de personas), de modo que lo que no cupo hoy sale mañana.
async function notifyFollowers(token: string | undefined, all: Candidate[]): Promise<void> {
  const followers = readFollowers();
  const chats = Object.keys(followers);
  const sentPath = path.join(dataDir(), "telegram_followers_sent.json");
  const sent: Record<string, State> = readJson(sentPath, {});
  const cutoff = new Date(Date.now() - STATE_DAYS * 864e5).toISOString();
  for (const chat of Object.keys(sent)) {
    if (!followers[chat]) delete sent[chat];
    else for (const k of Object.keys(sent[chat])) if (sent[chat][k] < cutoff) delete sent[chat][k];
  }

  const byTeam = new Map<string, Candidate[]>();
  for (const c of all) if (c.teamKey) byTeam.set(c.teamKey, [...(byTeam.get(c.teamKey) ?? []), c]);

  console.log(`\nSeguidores: ${chats.length} chats.`);
  let delivered = 0;
  for (const chat of chats) {
    const seen = new Set<string>();
    const picks = followers[chat]
      .flatMap((t) => byTeam.get(t) ?? [])
      .filter((c) => !sent[chat]?.[c.key])
      .sort((a, b) => b.score - a.score)
      .filter((c) => !seen.has(c.url) && seen.add(c.url))
      .slice(0, PER_FOLLOWER);
    if (!picks.length) continue;
    if (!token) {
      console.log(`[ensayo] ${picks.length} avisos para un seguidor de ${followers[chat].join(", ")}`);
      continue;
    }
    for (const c of picks) {
      try {
        await sendPrivate(token, chat, c);
        (sent[chat] ??= {})[c.key] = new Date().toISOString();
        delivered++;
      } catch (e) {
        // 403 = el usuario bloqueó el bot (o lo borró): se quita del almacén.
        if (e instanceof TelegramError && e.status === 403) {
          removeChat(chat);
          delete sent[chat];
          console.log("Un seguidor bloqueó el bot: eliminado.");
        } else {
          console.log(`Fallo enviando a un seguidor: ${(e as Error).message}`);
        }
        break;
      }
      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }
  }
  if (token) writeJsonAtomic(sentPath, sent);
  console.log(`Avisos privados ${token ? "enviados" : "que se enviarían"}: ${token ? delivered : "ensayo"}.`);
}

/** Elige los mensajes del canal: cuota por grupo, relleno sin entradas y,
 *  al final, como mucho una entrada si toca (1 de cada TICKET_EVERY). */
function pick(candidates: Candidate[], state: State): Candidate[] {
  const repeatCutoff = new Date(Date.now() - REPEAT_DAYS * 864e5).toISOString();
  const recentOfferUrls = new Set(
    Object.entries(state)
      .filter(([k, d]) => d >= repeatCutoff && !k.startsWith(SITE))
      .map(([k]) => k.split("|")[0]),
  );
  const fresh = candidates
    .filter((c) => !(state[c.key] >= repeatCutoff) && !recentOfferUrls.has(c.offerUrl))
    .sort((a, b) => b.score - a.score);
  // Una sola oferta por producto (la de más valor).
  const seen = new Set<string>();
  const best = fresh.filter((c) => !seen.has(c.key) && seen.add(c.key));

  const picks: Candidate[] = [];
  const taken = new Set<Candidate>();
  const take = (c: Candidate) => (picks.push(c), taken.add(c));
  for (const [group, quota] of Object.entries(QUOTA))
    best.filter((c) => GROUP[c.section] === group).slice(0, quota).forEach(take);
  for (const c of best) {
    if (picks.length >= PER_RUN) break;
    if (!taken.has(c) && GROUP[c.section] !== "entradas") take(c);
  }
  picks.splice(PER_RUN);

  // Mensajes sin entrada desde la última entrada publicada (nuevo formato).
  const history = Object.entries(state)
    .filter(([k]) => k.startsWith(SITE))
    .sort((a, b) => b[1].localeCompare(a[1]));
  const lastTicket = history.findIndex(([k]) => k.includes("/tickets/"));
  const sinceTicket = lastTicket === -1 ? Infinity : lastTicket;
  const ticket = best.find((c) => c.section === "entradas");
  if (ticket && picks.length < PER_RUN && sinceTicket + picks.length >= TICKET_EVERY - 1) picks.push(ticket);
  return picks;
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHANNEL_ID;
  const dryRun = FORCE_DRY_RUN || !token || !chat;

  const state: State = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")) : {};
  const cutoff = new Date(Date.now() - STATE_DAYS * 864e5).toISOString();
  for (const k of Object.keys(state)) if (state[k] < cutoff) delete state[k];

  const everything = collect();
  const picks = pick(everything, state);

  const bySection = (list: Candidate[]) => {
    const n = new Map<string, number>();
    for (const c of list) n.set(c.section, (n.get(c.section) ?? 0) + 1);
    return [...n].map(([s, k]) => `${s} ${k}`).join(", ");
  };
  console.log(`Archivo de precios hasta ${archive.lastDate}. Bajadas verificadas que cumplen: ${everything.length} (${bySection(everything)}).`);
  console.log(`Descartadas: ${[...rejected].map(([k, n]) => `${k} ${n}`).join("; ") || "ninguna"}.`);
  console.log(`Publico ${picks.length} (${bySection(picks)}).`);

  for (const c of picks) {
    console.log(`\n--- ${c.section} · valor ${c.score.toFixed(2)} ---\n${caption(c)}`);
    console.log(`[foto] ${c.imageUrl ?? "sin foto -- se publica como texto"}`);
    if (dryRun) continue;
    await send(token!, chat!, c);
    state[c.key] = new Date().toISOString();
    // Se guarda tras CADA envío: si uno falla a mitad de tanda, los ya
    // publicados quedan recordados y mañana no se repiten (pasó el 2026-10-10).
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 1) + "\n");
    // El límite del Bot API es ~20 mensajes por minuto a un canal.
    await new Promise((r) => setTimeout(r, 3500));
  }

  if (dryRun) {
    console.log(
      FORCE_DRY_RUN
        ? "\nENSAYO (--dry-run): no se publicó nada ni se tocó el estado."
        : "\nENSAYO: no se publicó nada en el canal. Faltan TELEGRAM_BOT_TOKEN y TELEGRAM_CHANNEL_ID (ver .env.local).",
    );
  } else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 1) + "\n");
    console.log(`\nPublicadas ${picks.length}. Estado: ${Object.keys(state).length} publicaciones recordadas.`);
  }

  // Los avisos privados solo necesitan el token (no el canal). Sin token: ensayo.
  await notifyFollowers(token, everything);
}

main();
