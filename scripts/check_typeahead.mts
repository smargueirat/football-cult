// Chequeo del cruce del autocompletado de la home (src/lib/search/typeahead.ts).
// Ejecutar: npx tsx scripts/check_typeahead.mts
import assert from "node:assert/strict";
import { fold, matchTypeahead, prepare, type TypeaheadEntry } from "../src/lib/search/typeahead";

assert.equal(fold("  Atlético de Madrid "), "atletico de madrid");
assert.equal(fold("SÃO Paulo-FC"), "sao paulo fc");
assert.equal(fold("Bayern München"), "bayern munchen");

const list = prepare([
  { g: "t", n: "Real Sociedad", h: "/equipo/realsociedad" },
  { g: "t", n: "Atlético de Madrid", h: "/equipo/atleticomadrid", k: "Atlético Madrid" },
  { g: "t", n: "Bayern Múnich", h: "/equipo/bayern", k: "Bayern Munich Bayern Monaco" },
  { g: "t", n: "Cerealito FC", h: "/equipo/cerealito" },
  { g: "l", n: "Premier League", h: "/liga/premier-league" },
  { g: "n", n: "Argentina", h: "/pais/argentina" },
  { g: "p", n: "Nike Mercurial Vapor 16", h: "/botas/x" },
  { g: "t", n: "Madrid Real", h: "/equipo/madridreal" },
] satisfies TypeaheadEntry[]);
const hrefs = (q: string) => matchTypeahead(list, q).map((e) => e.h);

// Acentos y mayúsculas no importan.
assert.deepEqual(hrefs("atletico"), ["/equipo/atleticomadrid"]);
assert.deepEqual(hrefs("ATLÉTICO MAD"), ["/equipo/atleticomadrid"]);
// Comienzo de palabra, no subcadena suelta: "real" no encuentra "Cerealito";
// y el que EMPIEZA por la consulta va antes.
assert.deepEqual(hrefs("real"), ["/equipo/realsociedad", "/equipo/madridreal"]);
// Busca también por el nombre en otros idiomas.
assert.deepEqual(hrefs("munich"), ["/equipo/bayern"]);
// Orden de grupos: equipos, selecciones, ligas, productos.
assert.deepEqual(hrefs("ar"), ["/pais/argentina"]);
assert.deepEqual(hrefs("mercurial"), ["/botas/x"]);
// Menos de 2 letras: nada.
assert.deepEqual(hrefs("p"), []);
assert.deepEqual(hrefs(" é "), []);

console.log("check_typeahead ok");
