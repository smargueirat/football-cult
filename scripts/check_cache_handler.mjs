// Chequeo de cache-handler.mjs:  node scripts/check_cache_handler.mjs
//
// En `next dev` la caché ISR no escribe nada (IncrementalCache.set sale antes
// en dev), así que esto prueba el handler directamente: mismo set() que llama
// Next en producción, sobre un directorio temporal. Una 404 no debe dejar
// ningún archivo; una 200 sí (la caché normal sigue funcionando).
import assert from "node:assert";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { default: Handler } = await import("../cache-handler.mjs");
const { nodeFs } = require("next/dist/server/lib/node-fs-methods");

const dir = mkdtempSync(join(tmpdir(), "fc-cache-"));
const files = () => readdirSync(dir, { recursive: true }).filter((f) => f.includes("."));
const page = (status) => ({
  kind: "APP_PAGE",
  html: "<html>x</html>",
  rscData: Buffer.from("rsc"),
  headers: {},
  postponed: undefined,
  status,
  segmentData: new Map([["/_tree", Buffer.from("t")]]),
});
try {
  const h = new Handler({ fs: nodeFs, flushToDisk: true, serverDistDir: dir, maxMemoryCacheSize: 0 });
  const ctx = { isRoutePPREnabled: false, isFallback: false };

  for (let i = 0; i < 50; i++) await h.set(`/es/camiseta/no-existe-${i}`, page(404), ctx);
  await h.set("/probe-123.php", page(404), ctx);
  assert.deepStrictEqual(files(), [], "una 404 escribió en disco");

  await h.set("/es/camiseta/real", page(200), ctx);
  assert.ok(files().length >= 3, `una 200 debería escribir html+rsc+meta, escribió: ${files()}`);
  console.log("ok: 51 páginas 404 -> 0 archivos; 1 página 200 ->", files().length, "archivos");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
