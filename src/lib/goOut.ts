// Lado servidor de /go/ (ver src/lib/go.ts y src/app/go/[id]/route.ts):
// 1) a qué clic se debe una venta (sub-id por red) y 2) qué clics son
// robots, para no mandárselos a las redes con nuestro id.
import { summarizeUserAgent } from "@/lib/clickLog";

// ---------------------------------------------------------------- atribución

/** Origen del clic, en el formato que vuelve en los informes de cada red. */
export type ClickSource = {
  section: string;
  locale: string;
  country: string;
  /** ficha3b = ficha, posición 3, era la mejor oferta. */
  origin: string;
  productId: string;
};

const clean = (s: string, max: number) => s.replace(/[^A-Za-z0-9_-]+/g, "-").slice(0, max);

// Reemplaza el valor si el parámetro ya existe (eBay trae `customid=` vacío,
// TradeTracker `r=`), si no lo añade al final. A mano y no con URL/URLSearchParams
// para no re-codificar el resto del enlace (`_skw=a+b`, `hash=...%3A...`).
function setParam(url: string, name: string, value: string): string {
  const re = new RegExp(`([?&]${name}=)[^&#]*`);
  if (re.test(url)) return url.replace(re, `$1${value}`);
  const [base, hash] = url.split("#", 2);
  return `${base}${base.includes("?") ? "&" : "?"}${name}=${value}${hash != null ? `#${hash}` : ""}`;
}

/**
 * Añade el sub-id propio de cada red. Nombres y límites según la ayuda pública:
 * Awin `clickref` (50 car. en el informe; clickref2-6 hasta 250), Webgains
 * `clickref`, eBay Partner Network `customid` (256), TradeTracker `r`,
 * Rakuten `u1` (72), Skimlinks `xcust` (50). Amazon Associates estándar no
 * tiene sub-id (`ascsubtag` es solo para programas especiales) y Soicos no
 * documenta ninguno: esos se devuelven tal cual.
 */
export function withSubId(url: string, s: ClickSource): string {
  const head = `${clean(s.section, 14)}_${clean(s.locale, 2)}_${clean(s.country, 2)}`;
  const all = `${head}_${clean(s.origin, 12)}_${clean(s.productId, 200)}`;
  if (/^https:\/\/www\.awin1\.com\//.test(url))
    return setParam(setParam(setParam(url, "clickref", head), "clickref2", clean(s.productId, 200)), "clickref3", clean(s.origin, 12));
  if (/^https:\/\/track\.webgains\.com\//.test(url)) return setParam(url, "clickref", all.slice(0, 50));
  if (/^https:\/\/www\.ebay\.[a-z.]+\/itm\//.test(url) && /[?&]campid=/.test(url)) return setParam(url, "customid", all.slice(0, 256));
  if (/^https:\/\/tc\.tradetracker\.net\//.test(url)) return setParam(url, "r", all.slice(0, 50));
  if (/^https:\/\/click\.linksynergy\.com\//.test(url)) return setParam(url, "u1", all.slice(0, 72));
  if (/^https:\/\/go\.skimresources\.com\//.test(url)) return setParam(url, "xcust", all.slice(0, 50));
  return url;
}

// Soicos (cuenta aid 56058; ver "Soicos" en scripts/catalog-mining/README.md):
// programas aprobados Nike CL 14271, Nike AR 14661 y Puma AR 14084. El enlace
// es plano y reconstruible: sclick?aid&pid&dl=<URL de la tienda codificada>.
// Las camisetas ya se guardan así; las botas minadas a mano quedaron con el
// enlace directo (sin comisión), y esto las envuelve: en el catálogo con
// scripts/fixes/tanda2_soicos_boots.mts y, por si entra otra a mano, en /go/.
const SOICOS_PID: [RegExp, number][] = [
  [/^https:\/\/www\.nike\.cl\//, 14271],
  [/^https:\/\/www\.nike\.com\.ar\//, 14661],
  [/^https:\/\/ar\.puma\.com\//, 14084],
];

export function soicosLink(url: string): string {
  const pid = SOICOS_PID.find(([re]) => re.test(url))?.[1];
  return pid ? `https://ad.soicos.com/sclick?aid=56058&pid=${pid}&dl=${encodeURIComponent(url)}` : url;
}

/**
 * La misma tienda sin nuestro tracking, para los clics de robot: el destino
 * real va dentro del enlace (Awin `ued`, TradeTracker `u`, Rakuten `murl`,
 * Soicos `dl`) o basta con quitar los parámetros de la red (eBay, Amazon).
 * null si no se puede saber (Awin pclick.php: el destino lo resuelve Awin).
 */
export function untracked(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const inner = ({
    "www.awin1.com": "ued",
    "tc.tradetracker.net": "u",
    "click.linksynergy.com": "murl",
    "ad.soicos.com": "dl",
    "go.skimresources.com": "url",
  } as Record<string, string>)[u.hostname];
  if (inner) {
    const dest = u.searchParams.get(inner);
    return dest && /^https?:\/\//.test(dest) ? dest : null;
  }
  if (/^www\.ebay\./.test(u.hostname)) ["mkevt", "mkcid", "mkrid", "campid", "customid", "toolid"].forEach((k) => u.searchParams.delete(k));
  else if (/^www\.amazon\./.test(u.hostname)) u.searchParams.delete("tag");
  return u.toString();
}

// ------------------------------------------------------------- filtro de bots
//
// Lo que se vio en el registro (oct-2026, 18.860 clics): más del 99 % llega
// en ráfagas de 100-1.900 clics/hora día y noche, con UA de Chrome/Edge/
// Firefox rotando, el idioma cambiando entre clic y clic sobre el mismo
// producto y los milisegundos amontonados en 800-899. Las personas son unas
// pocas por día. El registro viejo no guarda cabeceras ni IP, así que las
// reglas de cabeceras salen de cómo se comportan los navegadores, no de ese
// registro; desde ahora se anotan `sf` y `bot` para afinarlas.
//
// Regla de oro: ante la duda, persona. Ninguna regla bloquea: un "bot" va a
// la tienda sin tracking (o a la ficha), así una persona mal clasificada
// llega igual; solo se pierde la comisión de ese clic.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
/** Por subred (/24 en IPv4, primeros 4 bloques en IPv6). */
const PER_NET_MINUTE = 10;
const PER_NET_HOUR = 40;
/** Global: 60/h es varias veces el pico humano visto; las ráfagas van de 100 a 1.900/h. */
const SURGE_PER_HOUR = 60;

const byNet = new Map<string, number[]>();
let recent: number[] = [];

function netOf(ip: string): string {
  return ip.includes(":") ? ip.split(":").slice(0, 4).join(":") : ip.split(".").slice(0, 3).join(".");
}

export type BotReason = "prefetch" | "ua" | "headers" | "rate" | "surge";

/**
 * undefined = persona. `js` = el enlace lo tocó un puntero o un clic en la
 * página (src/lib/go.ts añade `j=1`): un script que recorre los href del HTML
 * no lo trae. Su ausencia sola no condena (teclado, JS desactivado...), pero
 * en plena ráfaga global es lo que separa a la persona del robot.
 */
export function botReason(h: Headers, js: boolean, now = Date.now()): BotReason | undefined {
  // Previsualización/precarga: nadie hizo clic.
  if (/prefetch|prerender|preview/i.test(`${h.get("sec-purpose") ?? ""} ${h.get("purpose") ?? ""} ${h.get("x-purpose") ?? ""} ${h.get("x-moz") ?? ""}`))
    return "prefetch";

  recent = recent.filter((t) => now - t < HOUR);
  recent.push(now);

  const ua = h.get("user-agent");
  if (!ua || summarizeUserAgent(ua) === "bot") return "ua";

  // Todo navegador manda Accept-Language, y Chrome/Edge/Firefox desde la v90
  // (2021) mandan Sec-Fetch-Mode en cada navegación HTTPS. Un UA que dice
  // "Chrome 120" sin Sec-Fetch-Mode es un script disfrazado. Safari e iOS no
  // entran en la regla de versión (Sec-Fetch llegó tarde en 16.4).
  const version = Number(ua.match(/(?:Chrome|Firefox)\/(\d+)/)?.[1] ?? 0);
  if (!h.get("sec-fetch-mode") && (!h.get("accept-language") || version >= 90)) return "headers";

  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) {
    if (byNet.size > 10_000) byNet.clear(); // tope de memoria; perderlo solo afloja el filtro un rato
    const net = netOf(ip);
    const hits = (byNet.get(net) ?? []).filter((t) => now - t < HOUR);
    hits.push(now);
    byNet.set(net, hits);
    if (hits.length > PER_NET_HOUR || hits.filter((t) => now - t < MINUTE).length > PER_NET_MINUTE) return "rate";
  }

  if (!js && recent.length > SURGE_PER_HOUR) return "surge";
  return undefined;
}

/** Solo para las pruebas. */
export function resetBotState() {
  byNet.clear();
  recent = [];
}
