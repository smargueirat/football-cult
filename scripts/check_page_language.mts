// Restos en español en las fichas de camiseta de /en /pt /fr /it:
//   npx tsx scripts/check_page_language.mts          (resumen)
//   npx tsx scripts/check_page_language.mts --list   (cada caso)
//
// Falla (exit 1) si:
//  - una etiqueta GENERADA por nosotros (nombre de ficha = H1/<title>/JSON-LD,
//    nombre del equipo, tipo de camiseta) lleva palabras españolas;
//  - el título que se muestra de una oferta (displayTitleForCountry y la fila
//    de cada oferta) conserva el nombre ESPAÑOL del equipo de la ficha
//    ("Olympique Marsella" en /fr).
// El resto del título de la tienda es el título real (feedback_realname_primary):
// sus palabras españolas (eBay ES escribe frases enteras) se cuentan, no fallan.
import { products } from "../src/data/products";
import { displayTitleForCountry, kitTypeName, teamNames } from "../src/lib/productMeta";
import { jerseyName } from "../src/lib/seoMeta";
import { localizeTeamName, spanishTeamForms, translateTitleVocabulary } from "../src/lib/i18n/titleGlossary";
import { cleanDisplayTitle } from "../src/lib/displayTitle";

const list = process.argv.includes("--list");
const LOCALES = ["en", "pt", "fr", "it"] as const;
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const SPANISH = /(?<![\p{L}])(equipaci[oó]n|camiseta|ni[ñn][oa]s?|hombre|mujer|primera|segunda|tercera|portero|entrenamiento|selecci[oó]n|temporada|manga larga|manga corta|prepartido)(?![\p{L}])/iu;
// La forma española se busca sin tildes ("Japon" de eBay ES); si el nombre
// correcto, con sus tildes, ya está (y no va dentro de la forma española,
// como "Inter" en "Inter de Milán"), no es un resto.
const hasForm = (title: string, forms: string[], target: string) =>
  forms.find((f) => ((fold(f) !== fold(target) && fold(f).includes(fold(target))) || !title.toLowerCase().includes(target.toLowerCase())) && new RegExp(`(?<![\\p{L}\\p{N}])${fold(f).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "u").test(fold(title)));

let fails = 0;
const fail = (msg: string) => {
  fails++;
  if (list || fails <= 15) console.error("  " + msg);
};

// Casos fijos del cambio de nombre.
const om = teamNames.marseille;
const CASOS: [string, Parameters<typeof localizeTeamName>[1], (typeof LOCALES)[number] | "es", string][] = [
  ["Camiseta Puma Olympique Marsella Primera Equipación 2025-2026", om, "fr", "Camiseta Puma Olympique de Marseille Primera Equipación 2025-2026"],
  ["Olympique de Marsella PUMA Authentic", om, "it", "Olympique Marsiglia PUMA Authentic"],
  ["Maillot Olympique de Marseille Domicile", om, "fr", "Maillot Olympique de Marseille Domicile"],
  ["Camiseta Olympique de Marsella", om, "es", "Camiseta Olympique de Marsella"],
  ["Camiseta Inter de Milán 2010", teamNames.intermilan, "it", "Camiseta Inter 2010"],
  ["Maglia Inter 2010 Inter de Milán", teamNames.intermilan, "it", "Maglia Inter 2010 Inter"],
  ["4.5/5 Bayern Munich adults L", teamNames.bayern, "pt", "4.5/5 Bayern de Munique adults L"],
  ["Camiseta Japon 2022", teamNames.japon, "en", "Camiseta Japan 2022"],
  ["SSC Napoli Home", teamNames.napoli, "fr", "SSC Napoli Home"], // nombre oficial, no se toca
  ["Camiseta Alemania 2007", teamNames.alemania, "pt", "Camiseta Alemanha 2007"],
  ["Camisa Croacia 2010/11 Reserva", teamNames.croacia, "pt", "Camisa Croácia 2010/11 Reserva"],
  ["Adidas Bayern Munich 1995/97 Home", teamNames.bayern, "en", "Adidas Bayern Munich 1995/97 Home"],
];
for (const [entra, team, loc, espera] of CASOS) {
  const sale = localizeTeamName(entra, team, loc);
  if (sale !== espera) fail(`caso: "${entra}" (${loc}) -> "${sale}", esperaba "${espera}"`);
}

const storeSpanish: Record<string, number> = {};
let checked = 0;
for (const p of products) {
  const team = teamNames[p.teamKey];
  const forms = spanishTeamForms(team);
  for (const loc of LOCALES) {
    for (const [what, label] of [["nombre", jerseyName(p, loc)], ["equipo", team[loc]], ["tipo", kitTypeName(p, loc)]] as const) {
      const m = label.match(SPANISH);
      if (m) fail(`${loc} ${p.id} ${what} generado con "${m[1]}": ${label}`);
    }
    const titles = [displayTitleForCountry(p, "ES", loc), ...p.offers.map((o) => o.title && cleanDisplayTitle(translateTitleVocabulary(o.title, loc, team)))];
    for (const t of titles) {
      if (!t) continue;
      checked++;
      const f = hasForm(t, forms, team[loc]);
      if (f) fail(`${loc} ${p.id} título con "${f}": ${t}`);
      if (SPANISH.test(t)) storeSpanish[loc] = (storeSpanish[loc] ?? 0) + 1;
    }
  }
}

console.log(`check_page_language: ${products.length} fichas x ${LOCALES.length} idiomas, ${checked} títulos mostrados, ${CASOS.length} casos fijos`);
console.log(`  (info) títulos reales de tienda con palabras españolas, sin contar el equipo: ${JSON.stringify(storeSpanish)}`);
if (fails) {
  console.error(`FALLA check_page_language: ${fails} problemas${list ? "" : " (--list para verlos todos)"}`);
  process.exit(1);
}
console.log("check_page_language ok");
