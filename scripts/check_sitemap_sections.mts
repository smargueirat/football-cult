// URLs del sitemap por sección:  npx tsx scripts/check_sitemap_sections.mts
//
// Las fichas de entradas quedaron fuera del sitemap sin que nadie lo viera
// (tierOf miraba la foto solo en las ofertas y las entradas la tienen en la
// ficha). Esto imprime cuántas fichas de cada sección entran y falla si
// alguna sección con catálogo queda en cero.
import assert from "node:assert";
import * as sm from "../src/app/sitemap";

// sitemap.ts se carga como CJS (el repo no es "type": "module"): el default
// llega envuelto una vez más.
const sitemap = ((sm.default as unknown as { default?: typeof sm.default }).default ?? sm.default);
const { generateSitemaps } = sm;

const FICHA_SECTIONS = ["camiseta", "botas", "guantes", "pelotas", "tickets", "ropa", "entrenamiento"];
const counts: Record<string, number> = {};
for (const { id } of await generateSitemaps()) {
  for (const { url } of await sitemap({ id: Promise.resolve(String(id)) })) {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    // /es/{sección}/{id} es ficha; todo lo demás (fijas, hubs, índices) va junto.
    const key = parts.length === 3 && FICHA_SECTIONS.includes(parts[1]) ? parts[1] : "hubs/fijas";
    counts[key] = (counts[key] ?? 0) + 1;
  }
}
console.table(counts);
for (const s of FICHA_SECTIONS) assert.ok((counts[s] ?? 0) > 0, `sección sin fichas en el sitemap: ${s}`);
