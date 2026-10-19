// JSON-LD de las fichas y los listados (sku / gtin / dateModified / ItemList):
//   npx tsx scripts/check_structured_data.mts                    (solo datos: todos los GTIN con dígito de control correcto)
//   npx tsx scripts/check_structured_data.mts http://localhost:3201   (además descarga páginas de ejemplo y valida su JSON-LD)
//
// Falla (exit 1) si un GTIN no cuadra, si una ficha no lleva sku = su id, si
// el dateModified no es el del último cambio real de precio (priceArchive) o
// si /tickets no enumera eventos con nombre, fecha y enlace.
import gtins from "../src/data/offerGtins.json";
import { products } from "../src/data/products";
import { bootProducts } from "../src/data/boots";
import { productGtin, validGtin } from "../src/lib/offerGtin";
import { modifiedLd } from "../src/lib/seoMeta";
import { retroTeamFacets } from "../src/lib/extraHubs";

let bad = 0;
const fail = (m: string) => {
  bad++;
  console.log("FALLA " + m);
};

// --- datos
const all = Object.values(gtins as Record<string, string>);
const invalid = all.filter((g) => !validGtin(g));
if (invalid.length) fail(`${invalid.length} GTIN con dígito de control incorrecto en offerGtins.json, p. ej. ${invalid[0]}`);
if (!validGtin("4006381333931") || validGtin("4006381333932") || validGtin("123") || validGtin("40063813339X1")) fail("validGtin no distingue EAN-13 válidos");
const withGtin = (items: { offers: { url: string; sizes?: readonly string[] }[] }[]) => items.filter((i) => Object.keys(productGtin(i.offers)).length).length;
console.log(`GTIN: ${all.length} válidos en offerGtins.json · fichas con gtin en el Product: ${withGtin(products)} camisetas, ${withGtin(bootProducts as never)} botas`);

// --- páginas
const base = process.argv[2];
if (base) {
  const ld = async (path: string) => {
    const html = await (await fetch(base + path)).text();
    const nodes: any[] = [];
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        nodes.push(...[JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"))].flat());
      } catch (e) {
        fail(`${path}: JSON-LD no es JSON válido (${(e as Error).message})`);
      }
    }
    return nodes;
  };
  const checkProduct = async (path: string, p: { id: string; offers: { url: string }[] }) => {
    const nodes = await ld(path);
    const prod = nodes.find((n) => n["@type"] === "Product");
    const page = nodes.find((n) => n["@type"] === "ItemPage");
    if (!prod) return fail(`${path}: sin Product`);
    if (prod.sku !== p.id) fail(`${path}: sku ${prod.sku} != ${p.id}`);
    for (const k of Object.keys(prod).filter((k) => /^gtin/.test(k))) if (!validGtin(prod[k])) fail(`${path}: ${k} ${prod[k]} inválido`);
    const want = modifiedLd(p.offers).dateModified;
    if (page?.dateModified !== want) fail(`${path}: dateModified ${page?.dateModified} != ${want}`);
    if (page && page.mainEntity?.["@id"] !== prod["@id"]) fail(`${path}: ItemPage no apunta al Product`);
    console.log(`${path}: sku=${prod.sku} mpn=${prod.mpn ?? "-"} gtin=${Object.entries(prod).find(([k]) => /^gtin/.test(k))?.[1] ?? "-"} dateModified=${page?.dateModified ?? "-"}`);
  };
  const dated = (items: { id: string; offers: { url: string }[] }[]) => items.filter((i) => modifiedLd(i.offers).dateModified);
  const jersey = products.find((p) => Object.keys(productGtin(p.offers)).length && modifiedLd(p.offers).dateModified) ?? dated(products)[0];
  const jerseyNoDate = products.find((p) => !modifiedLd(p.offers).dateModified);
  const boot = bootProducts.find((p) => Object.keys(productGtin(p.offers)).length) ?? bootProducts[0];
  await checkProduct(`/es/camiseta/${jersey.id}`, jersey);
  if (jerseyNoDate) await checkProduct(`/es/camiseta/${jerseyNoDate.id}`, jerseyNoDate); // sin fecha real: no hay ItemPage
  await checkProduct(`/es/botas/${boot.id}`, boot);
  const bootDated = dated(bootProducts as never)[0] as typeof boot | undefined;
  if (bootDated) await checkProduct(`/es/botas/${bootDated.id}`, bootDated);

  const tickets = await ld("/es/tickets");
  const list = tickets.find((n) => n["@type"] === "CollectionPage")?.mainEntity?.itemListElement ?? [];
  if (!list.length || list.length > 20) fail(`/es/tickets: ItemList con ${list.length} eventos`);
  for (const it of list) if (!it.item?.name || !/^\d{4}-\d\d-\d\dT/.test(it.item?.startDate ?? "") || !it.url) fail(`/es/tickets: evento incompleto ${JSON.stringify(it).slice(0, 120)}`);
  console.log(`/es/tickets: ItemList de ${list.length} eventos`);

  const team = retroTeamFacets()[0].team;
  const hub = (await ld(`/en/retro/${team}`)).find((n) => n["@type"] === "CollectionPage");
  if (!hub) fail(`/en/retro/${team}: sin CollectionPage`);
  console.log(`/en/retro/${team}: dateModified=${hub?.dateModified ?? "-"}`);
}

console.log(bad ? `${bad} problema(s)` : "OK");
process.exit(bad ? 1 : 0);
