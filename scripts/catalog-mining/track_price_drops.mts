// Rastreo diario de bajadas de precio:  npx tsx scripts/catalog-mining/track_price_drops.mts
//
// Corre UNA VEZ POR DÍA como último paso de daily_scan.sh, después de que
// todas las tiendas ya actualizaron sus precios reales -- así el snapshot
// de "hoy" que guarda al final ya refleja el catálogo del día, listo para
// ser el "ayer" de mañana.
//
// Anota los precios de hoy en el archivo durable (data/price-history) y
// escribe src/data/priceDrops.json con las bajadas VERIFICADAS de cada
// oferta (la URL identifica a una oferta concreta: misma tienda, mismo
// producto): precio anterior vigente al menos MIN_PREVIOUS_DAYS días en
// nuestro archivo, igual a su precio habitual, y precio actual el más bajo
// de los últimos 30 días (ver verifiedDrop en src/lib/priceArchive.ts); se
// descartan los días en que media tienda bajó a la vez (massDropDays). Hasta el 2026-10-09 era
// "bajó desde ayer", y las entradas de reventa que suben y bajan cada día
// llenaban las bajadas (94 %) y el canal de Telegram. Se recalcula entero
// en cada corrida y no depende del snapshot de ayer: correrlo dos veces
// el mismo día da lo mismo.
//
// Reemplaza a track_price_drops.py, que solo cubría camisetas porque
// inyectaba un campo `previousPrice` con expresiones regulares dentro de
// products.ts. Las otras seis secciones nunca lo recibían (ver el
// comentario largo de src/lib/priceDrops.ts). Esto está en TypeScript
// justamente para no volver a parsear el catálogo con regex: importa los
// módulos de datos y lee las ofertas con el parser de verdad, que es lo
// único seguro con literales multilínea donde `sizePrices` anidado
// también tiene `price` y `url`.
import fs from "node:fs";
import path from "node:path";
import { products } from "../../src/data/products";
import { bootProducts } from "../../src/data/boots";
import { ticketProducts } from "../../src/data/tickets";
import { apparelProducts } from "../../src/data/apparel";
import { gloveProducts } from "../../src/data/gloves";
import { ballProducts } from "../../src/data/balls";
import { trainingProducts } from "../../src/data/training";
import { appendChanges, loadArchive, massDropDays, verifiedDrop } from "../../src/lib/priceArchive";
import { ticketTemplatePrices } from "../../src/lib/offerMoney";

const HERE = import.meta.dirname;
const REPO_ROOT = path.join(HERE, "..", "..");
const SNAPSHOT_PATH = path.join(HERE, "price_snapshot.json");
const DROPS_PATH = path.join(REPO_ROOT, "src", "data", "priceDrops.json");
// Vive en src/data/ (no junto al snapshot) porque lo importa la ficha de
// producto para la sparkline de historial.
const HISTORY_PATH = path.join(REPO_ROOT, "src", "data", "priceHistory.json");
// Ventana chica a propósito: es un gráfico de tendencia reciente, no un
// archivo histórico. Y solo de camisetas: el archivo ya pesa 8,2 MB con
// una sección, y el límite que de verdad ajusta en Vercel Hobby es el
// almacenamiento del despliegue (ver la auditoría del 24-09). Las otras
// secciones no tienen sparkline, así que no pagamos ese peso por un dato
// que nadie muestra.
const HISTORY_DAYS = 14;

interface Snapshot {
  [url: string]: { price: number; currency: string };
}

type RawOffer = { price: number; currency: string; url: string; store?: string };

/** Todas las ofertas del catálogo, sección por sección. */
function allOffers(): { section: string; offers: RawOffer[] }[] {
  const withOffers = (list: readonly { offers?: readonly unknown[] }[]) =>
    list.flatMap((p) => (p.offers ?? []) as RawOffer[]);
  return [
    { section: "camisetas", offers: withOffers(products) },
    { section: "botas", offers: withOffers(bootProducts) },
    { section: "entradas", offers: withOffers(ticketProducts) },
    { section: "ropa", offers: withOffers(apparelProducts) },
    { section: "guantes", offers: withOffers(gloveProducts) },
    { section: "pelotas", offers: withOffers(ballProducts) },
    { section: "entrenamiento", offers: withOffers(trainingProducts) },
  ];
}

function readJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function main() {
  const sections = allOffers();
  const today = new Date().toISOString().slice(0, 10);
  const archiveDir = path.join(REPO_ROOT, "data", "price-history");

  // Primero el archivo: las bajadas se miden contra él. Si falla no tumba
  // el resto del rastreo (sin el dato de hoy simplemente no hay bajadas).
  let archiveNote = "";
  try {
    const r = appendChanges(sections.flatMap((s) => s.offers), today, archiveDir);
    archiveNote = `; archivo: +${r.added} líneas (${r.changed} cambios, ${r.firstSeen} ofertas nuevas)`;
  } catch (err) {
    console.error("archivo de precios: NO se pudo escribir:", err);
  }
  const arch = loadArchive(archiveDir);
  const templates = ticketTemplatePrices(ticketProducts);

  const current: Snapshot = {};
  const drops: Record<string, number> = {};
  const droppedBySection = new Map<string, number>();

  for (const { section, offers } of sections) {
    // Medio catálogo de una tienda bajando el mismo día es un cambio del feed
    // o de la minería (precio de lista -> de venta), no una rebaja.
    const mass = massDropDays(offers.filter((o) => o.url && o.store) as { store: string; url: string }[], arch);
    for (const o of offers) {
      if (!o.url || !(o.price > 0)) continue;
      current[o.url] = { price: o.price, currency: o.currency };
      const d = verifiedDrop(o.url, o.price, o.currency, arch);
      if (!d || mass.has(`${o.store}|${d.since}`)) continue;
      // Entradas: ni precio de plantilla (antes o ahora) ni un precio visto
      // una sola vez; la reventa cambia cada día.
      if (section === "entradas") {
        if (templates.has(`${o.store}|${o.price}`) || templates.has(`${o.store}|${d.previous}`)) continue;
        if (d.daysAtCurrent < 2) continue;
      }
      drops[o.url] = d.previous;
      droppedBySection.set(section, (droppedBySection.get(section) ?? 0) + 1);
    }
  }

  // Compacto y ordenado: ordenado para que el diff de git sea legible,
  // compacto porque el snapshot de las siete secciones triplica el de
  // camisetas y todo esto viaja en el despliegue.
  const sorted = (obj: Record<string, unknown>) =>
    Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));

  fs.writeFileSync(DROPS_PATH, JSON.stringify(sorted(drops), null, 1) + "\n");
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(sorted(current)) + "\n");

  // Historial solo de camisetas (ver HISTORY_DAYS arriba).
  const history = readJson<Record<string, { date: string; price: number }[]>>(HISTORY_PATH, {});
  for (const o of sections[0].offers) {
    if (!o.url || !(o.price > 0)) continue;
    const days = (history[o.url] ?? []).filter((d) => d.date !== today);
    days.push({ date: today, price: o.price });
    history[o.url] = days.slice(-HISTORY_DAYS);
  }
  // No borra URLs que ya no están en el catálogo de hoy (oferta
  // discontinuada): si vuelve más adelante, retoma su propia historia.
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(sorted(history)) + "\n");

  const total = Object.keys(current).length;
  const dropped = Object.keys(drops).length;
  const detail = sections
    .map(({ section }) => `${section} ${droppedBySection.get(section) ?? 0}`)
    .join(", ");
  console.log(`${total} ofertas en el snapshot de hoy, ${dropped} bajadas (${detail})${archiveNote}`);
}

main();
