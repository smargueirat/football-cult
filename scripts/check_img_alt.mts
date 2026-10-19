// Texto alternativo de las imágenes. Falla (exit 1) si hay una <img> o <Image>
// sin atributo alt:
//   npx tsx scripts/check_img_alt.mts                  (analiza src/**/*.tsx con el AST de TypeScript)
//   npx tsx scripts/check_img_alt.mts URL [URL...]     (además descarga esas páginas y revisa el HTML)
//
// Reglas: toda imagen lleva alt. alt="" es válido solo para decorativas y
// entonces debe llevar también aria-hidden (en la propia imagen o en un
// ancestro del HTML renderizado); una imagen que informa lleva alt
// descriptivo (nombre de la camiseta, del equipo, de la sección).
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

let bad = 0;
const fail = (msg: string) => {
  bad++;
  console.log("FALLA " + msg);
};

// 1) Fuentes: <img ...> / <Image ...> sin alt (se admite {...props}, que puede traerlo).
function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".tsx") ? [path.join(dir, e.name)] : []));
}
let imgs = 0;
for (const file of walk("src")) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (n: ts.Node) => {
    if ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && /^(img|Image)$/.test(n.tagName.getText(sf))) {
      imgs++;
      const attrs = n.attributes.properties;
      const ok = attrs.some((a) => ts.isJsxSpreadAttribute(a) || (ts.isJsxAttribute(a) && a.name.getText(sf) === "alt"));
      if (!ok) fail(`${file}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1} <${n.tagName.getText(sf)}> sin alt`);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
console.log(`fuentes: ${imgs} imágenes revisadas`);

// 2) HTML renderizado (opcional): sin alt, o alt vacío sin aria-hidden (propio o de un ancestro).
for (const url of process.argv.slice(2)) {
  const html = await (await fetch(url)).text();
  const stack: boolean[] = []; // aria-hidden de los ancestros abiertos
  let n = 0;
  let empty = 0;
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)) {
    const [, close, tag, attrs] = m;
    if (/^(script|style)$/i.test(tag)) continue;
    if (/^(img|br|hr|input|meta|link|source|area|base|col|embed|track|wbr)$/i.test(tag) || attrs.endsWith("/")) {
      if (tag.toLowerCase() !== "img") continue;
      n++;
      const alt = attrs.match(/\balt="([^"]*)"/);
      const hidden = /aria-hidden(?!="false")/.test(attrs) || stack.some(Boolean);
      if (!alt) fail(`${url}: <img> sin alt: ${attrs.slice(0, 90)}`);
      else if (alt[1] === "") {
        empty++;
        if (!hidden) fail(`${url}: alt vacío sin aria-hidden: ${attrs.slice(0, 90)}`);
      }
      continue;
    }
    if (close) stack.pop();
    else stack.push(/aria-hidden(?!="false")/.test(attrs));
  }
  console.log(`${url}: ${n} imágenes, ${empty} decorativas (alt="" + aria-hidden)`);
}

console.log(bad ? `${bad} problema(s)` : "OK");
process.exit(bad ? 1 : 0);
