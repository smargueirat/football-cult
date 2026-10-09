// Unicidad y longitud de los <title> de TODAS las fichas, en los 5 idiomas:
//   npx tsx scripts/check_seo_titles.mts            (resumen)
//   npx tsx scripts/check_seo_titles.mts --dups     (lista los repetidos)
//
// Falla (exit 1) si dos fichas de un idioma comparten título o si una
// camiseta de temporada > 2006 lleva "Retro" en el título (regla fija:
// retro = isVintageRetro()). La longitud > 60 se informa, no falla: la
// regla es "<= 60 cuando se pueda" y el nombre real de algunos modelos no
// cabe sin perder lo que lo distingue.
import { products } from "../src/data/products";
import { bootProducts } from "../src/data/boots";
import { gloveProducts } from "../src/data/gloves";
import { ballProducts } from "../src/data/balls";
import { apparelProducts } from "../src/data/apparel";
import { trainingProducts } from "../src/data/training";
import { ticketProducts } from "../src/data/tickets";
import { LOCALES } from "../src/lib/i18n/locales";
import { isVintageRetro } from "../src/lib/productMeta";
import { gearTitle, jerseyTitle, ticketTitle, TITLE_MAX, jerseyDescription } from "../src/lib/seoMeta";

const showDups = process.argv.includes("--dups");
let failed = false;

const sections: [string, { id: string }[], (i: never, l: (typeof LOCALES)[number]) => string][] = [
  ["camisetas", products, jerseyTitle as never],
  ["botas", bootProducts, ((i: never, l: never) => gearTitle("botas", i, l)) as never],
  ["ropa", apparelProducts, ((i: never, l: never) => gearTitle("ropa", i, l)) as never],
  ["entrenamiento", trainingProducts, ((i: never, l: never) => gearTitle("entrenamiento", i, l)) as never],
  ["guantes", gloveProducts, ((i: never, l: never) => gearTitle("guantes", i, l)) as never],
  ["pelotas", ballProducts, ((i: never, l: never) => gearTitle("pelotas", i, l)) as never],
  ["tickets", ticketProducts, ticketTitle as never],
];

for (const locale of LOCALES) {
  const seen = new Map<string, string[]>();
  const rows: string[] = [];
  for (const [name, items, title] of sections) {
    let long = 0;
    let len = 0;
    for (const it of items) {
      const t = title(it as never, locale);
      len += t.length;
      if (t.length > TITLE_MAX) long++;
      const k = t.toLowerCase();
      seen.set(k, [...(seen.get(k) ?? []), `${name}/${it.id}`]);
    }
    rows.push(`${name} ${items.length} (>${TITLE_MAX}: ${long}, media ${Math.round(len / Math.max(1, items.length))})`);
  }
  const dups = [...seen.entries()].filter(([, ids]) => ids.length > 1);
  const dupPages = dups.reduce((a, [, ids]) => a + ids.length, 0);
  console.log(`[${locale}] ${seen.size} títulos únicos · repetidos: ${dups.length} títulos / ${dupPages} fichas · ${rows.join(" · ")}`);
  if (dups.length) {
    failed = true;
    for (const [t, ids] of dups.slice(0, showDups ? 1000 : 5)) console.log(`   "${t}" x${ids.length}: ${ids.slice(0, 4).join(", ")}`);
  }
}

const badRetro = products.filter((p) => !isVintageRetro(p) && /\bretr[oôòó]\b/i.test(jerseyTitle(p, "es") + jerseyDescription(p, "es")));
console.log(`Camisetas de temporada > 2006 con "Retro" en título/descripción: ${badRetro.length}`);
if (badRetro.length) {
  failed = true;
  console.log(badRetro.slice(0, 10).map((p) => `   ${p.id}: ${jerseyTitle(p, "es")}`).join("\n"));
}
process.exit(failed ? 1 : 0);
