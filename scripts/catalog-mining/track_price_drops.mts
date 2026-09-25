// Rastreo diario de bajadas de precio:  npx tsx scripts/catalog-mining/track_price_drops.mts
//
// Corre UNA VEZ POR DÍA como último paso de daily_scan.sh, después de que
// todas las tiendas ya actualizaron sus precios reales -- así el snapshot
// de "hoy" que guarda al final ya refleja el catálogo del día, listo para
// ser el "ayer" de mañana.
//
// Compara el precio de cada oferta (la URL identifica a una oferta
// concreta: misma tienda, mismo producto) contra el snapshot del día
// anterior y escribe src/data/priceDrops.json con las que bajaron. Se
// recalcula entero en cada corrida: el dato es "bajó desde ayer", no un
// historial que se acumula.
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

type RawOffer = { price: number; currency: string; url: string };

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
  const previous = readJson<Snapshot>(SNAPSHOT_PATH, {});

  const current: Snapshot = {};
  const drops: Record<string, number> = {};
  const droppedBySection = new Map<string, number>();

  for (const { section, offers } of sections) {
    for (const o of offers) {
      if (!o.url || !(o.price > 0)) continue;
      current[o.url] = { price: o.price, currency: o.currency };
      const old = previous[o.url];
      // Misma moneda a propósito: un cambio de moneda de la tienda no es
      // una bajada de precio, y compararlo mostraría rebajas inventadas.
      if (old && old.currency === o.currency && old.price > o.price) {
        drops[o.url] = old.price;
        droppedBySection.set(section, (droppedBySection.get(section) ?? 0) + 1);
      }
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
  const today = new Date().toISOString().slice(0, 10);
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
  console.log(`${total} ofertas en el snapshot de hoy, ${dropped} bajadas (${detail})`);
}

main();
