// Envuelve en Soicos los enlaces directos de Nike CL/AR y Puma AR de botas
// (y de cualquier sección, por si aparecen). Idempotente: un enlace ya
// envuelto no vuelve a coincidir.
//   npx tsx scripts/fixes/tanda2_soicos_boots.mts
import fs from "node:fs";
import path from "node:path";
import { soicosLink } from "../../src/lib/goOut";

const DATA = path.join(import.meta.dirname, "..", "..", "src", "data");
const DIRECT = /\burl: "(https:\/\/(?:www\.nike\.cl|www\.nike\.com\.ar|ar\.puma\.com)\/[^"]*)"/g;

for (const f of ["boots.ts", "apparel.ts", "training.ts", "gloves.ts", "balls.ts", "products.ts"]) {
  const file = path.join(DATA, f);
  const src = fs.readFileSync(file, "utf-8");
  let n = 0;
  const out = src.replace(DIRECT, (_, url: string) => (n++, `url: "${soicosLink(url)}"`));
  if (n) fs.writeFileSync(file, out);
  console.log(`${f}: ${n} enlaces envueltos en Soicos`);
}
