#!/usr/bin/env node
// Volcado legible de TODO Redis (usuarios, suscripciones de alertas de precio,
// tokens, opsAlertChats...) a JSON, y su restauración.
//
//   node redis_dump.mjs dump > redis.json
//   node redis_dump.mjs restore redis.json [--force]
//
// Usa REDIS_URL de FC_ENV (por defecto el .env.local de la Mini PC) y la
// librería "redis" del repo (FC_APP). restore se niega a escribir en una base
// que no esté vacía salvo con --force (pensado para una Redis nueva).
import fs from "node:fs";
import { createRequire } from "node:module";

const ENV = process.env.FC_ENV || "/home/piojo/football-cult/.env.local";
const APP = process.env.FC_APP || "/home/piojo/football-cult";
if (!process.env.REDIS_URL && fs.existsSync(ENV)) process.loadEnvFile(ENV);
const { createClient } = createRequire(`${APP}/package.json`)("redis");

const [mode, file] = process.argv.slice(2);
const c = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 15000, reconnectStrategy: false } });
c.on("error", (e) => console.error("redis:", e.message));
await c.connect();

async function read(key) {
  const [type, pttl] = await Promise.all([c.type(key), c.pTTL(key)]);
  const value =
    type === "string" ? await c.get(key)
    : type === "hash" ? await c.hGetAll(key)
    : type === "set" ? await c.sMembers(key)
    : type === "zset" ? await c.zRangeWithScores(key, 0, -1)
    : type === "list" ? await c.lRange(key, 0, -1)
    : null; // stream u otros: no se usan en este proyecto
  return { key, type, pttl, value };
}

if (mode === "dump") {
  const out = [];
  for await (const keys of c.scanIterator({ COUNT: 1000 })) {
    // node-redis encola en pipeline las peticiones simultáneas: 9K claves en segundos.
    out.push(...(await Promise.all([].concat(keys).map(read))));
  }
  process.stdout.write(JSON.stringify(out) + "\n");
  console.error(`redis_dump: ${out.length} claves`);
} else if (mode === "restore" && file) {
  const rows = JSON.parse(fs.readFileSync(file, "utf-8"));
  if ((await c.dbSize()) > 0 && !process.argv.includes("--force")) {
    console.error("La Redis de destino no está vacía. Usa --force para sobrescribir.");
    process.exit(1);
  }
  let n = 0;
  for (let i = 0; i < rows.length; i += 500) {
    await Promise.all(
      rows.slice(i, i + 500).map(async ({ key, type, pttl, value }) => {
        if (value == null) return;
        await c.del(key);
        if (type === "string") await c.set(key, value);
        else if (type === "hash" && Object.keys(value).length) await c.hSet(key, value);
        else if (type === "set" && value.length) await c.sAdd(key, value);
        else if (type === "zset" && value.length) await c.zAdd(key, value);
        else if (type === "list" && value.length) await c.rPush(key, value);
        if (pttl > 0) await c.pExpire(key, pttl);
        n++;
      }),
    );
  }
  console.error(`redis_dump: ${n} claves restauradas`);
} else {
  console.error("uso: redis_dump.mjs dump | restore <archivo> [--force]");
  process.exit(2);
}
await c.quit();
