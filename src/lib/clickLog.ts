import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Registro de clics salientes: una línea JSON por clic, un archivo por mes.
// Append-only y FUERA de .next (cada deploy compila en una copia nueva).
//
// Sin IP ni identificadores: ni cookies, ni referer, ni el user agent
// crudo (solo navegador/sistema/dispositivo, ver summarizeUserAgent).
//
// CLICK_LOG_DIR existe porque deploy_local.sh clona el repo en una carpeta
// nueva en cada publicación: el valor por omisión (data/clicks dentro del
// cwd) se perdería en cada deploy. En producción hay que apuntarlo a una
// carpeta fija.
const DIR = process.env.CLICK_LOG_DIR || path.join(process.cwd(), "data", "clicks");

// Tope de escrituras por minuto: un bot que pegue a /go/ con ids al azar
// no debe poder llenar el disco. Los clics reales de un sitio con este
// tráfico no se acercan.
const MAX_PER_MINUTE = 1000;
let windowStart = 0;
let windowCount = 0;

export type ClickRecord = {
  t: string;
  /** false = id que no se pudo resolver (se mandó a la ficha o al home). */
  ok: boolean;
  k: string;
  p: string;
  s?: string;
  u?: string;
  l: string;
  o: string;
  n?: number;
  b?: boolean;
  ua: string;
  // Desde 2026-10-09 (las filas anteriores no los tienen; ver
  // scripts/clicks_report.py). La IP solo se usa en memoria para contar
  // ráfagas (src/lib/goOut.ts) y nunca se escribe.
  /** Persona probable (false = robot: no se mandó a la red con nuestro id). */
  h?: boolean;
  /** Por qué se clasificó como robot (BotReason). */
  bot?: string;
  /** País de Cloudflare (cf-ipcountry); XX = desconocido. */
  cc?: string;
  /** Sec-Fetch-Site del navegador ("-" = no vino). */
  sf?: string;
  /** El enlace lo tocó un puntero/clic en la página (j=1). */
  j?: boolean;
};

export async function logClick(rec: ClickRecord): Promise<void> {
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    windowCount = 0;
  }
  if (++windowCount > MAX_PER_MINUTE) return;
  try {
    await mkdir(DIR, { recursive: true });
    await appendFile(path.join(DIR, `${rec.t.slice(0, 7)}.jsonl`), JSON.stringify(rec) + "\n");
  } catch (err) {
    // Medir nunca puede romper la redirección.
    console.error("clickLog:", err instanceof Error ? err.message : err);
  }
}

// "chrome/android/mobile", "safari/ios/mobile", "bot". Lo justo para separar
// móvil de escritorio y descartar crawlers al analizar.
export function summarizeUserAgent(ua: string | null): string {
  if (!ua) return "unknown";
  if (/bot|crawl|spider|slurp|preview|facebookexternalhit|headless|curl|wget|python|node-fetch|go-http/i.test(ua)) return "bot";
  const browser = /SamsungBrowser/i.test(ua)
    ? "samsung"
    : /Edg\//i.test(ua)
      ? "edge"
      : /OPR\/|Opera/i.test(ua)
        ? "opera"
        : /Firefox|FxiOS/i.test(ua)
          ? "firefox"
          : /Chrome|CriOS/i.test(ua)
            ? "chrome"
            : /Safari/i.test(ua)
              ? "safari"
              : "other";
  const os = /Android/i.test(ua)
    ? "android"
    : /iPhone|iPad|iPod/i.test(ua)
      ? "ios"
      : /Windows/i.test(ua)
        ? "windows"
        : /Mac OS X|Macintosh/i.test(ua)
          ? "macos"
          : /Linux|X11/i.test(ua)
            ? "linux"
            : "other";
  const device = /Mobi|Android|iPhone|iPod/i.test(ua) ? "mobile" : "desktop";
  return `${browser}/${os}/${device}`;
}
