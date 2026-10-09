#!/usr/bin/env node
// Aviso al móvil del dueño: ntfy.sh (si hay NTFY_TOPIC) + Telegram a cada chat
// del set de Redis "opsAlertChats" (lo rellena "/start alertas" en el bot).
//
//   node notify.mjs "Título" "Mensaje"
//
// Variables (con valores por defecto para la Mini PC):
//   FC_ENV     .env.local con TELEGRAM_BOT_TOKEN y REDIS_URL
//   FC_APP     carpeta con node_modules/redis
//   FC_ALERTS  archivo con NTFY_TOPIC=... (fuera del repo: el repo es público)
// Sale con 0 si al menos un canal entregó el aviso; 1 si ninguno.
import fs from "node:fs";
import { createRequire } from "node:module";

const ENV = process.env.FC_ENV || "/home/piojo/football-cult/.env.local";
const APP = process.env.FC_APP || "/home/piojo/football-cult";
const ALERTS = process.env.FC_ALERTS || `${process.env.HOME}/.config/fc-alerts.env`;
for (const f of [ENV, ALERTS]) if (fs.existsSync(f)) process.loadEnvFile(f);

const [title = "football-cult.com", msg = "(sin texto)"] = process.argv.slice(2);
const ok = [];

if (process.env.NTFY_TOPIC) {
  try {
    // Publicación JSON: admite acentos/emojis en el título (las cabeceras no).
    const r = await fetch("https://ntfy.sh/", {
      method: "POST",
      body: JSON.stringify({ topic: process.env.NTFY_TOPIC, title, message: msg, priority: 4 }),
      signal: AbortSignal.timeout(15000),
    });
    if (r.ok) ok.push("ntfy");
    else console.error(`ntfy: HTTP ${r.status}`);
  } catch (e) {
    console.error(`ntfy: ${e.message}`);
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (token && process.env.REDIS_URL) {
  let chats = [];
  try {
    const { createClient } = createRequire(`${APP}/package.json`)("redis");
    const c = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 10000, reconnectStrategy: false } });
    c.on("error", () => {});
    await c.connect();
    chats = await c.sMembers("opsAlertChats");
    await c.quit();
  } catch (e) {
    console.error(`redis: ${e.message}`);
  }
  for (const chat_id of chats) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id, text: `${title}\n${msg}`, link_preview_options: { is_disabled: true } }),
        signal: AbortSignal.timeout(15000),
      });
      if (r.ok) ok.push(`telegram:${chat_id}`);
      else console.error(`telegram ${chat_id}: HTTP ${r.status}`);
    } catch (e) {
      console.error(`telegram ${chat_id}: ${e.message}`);
    }
  }
}

console.log(ok.length ? `enviado: ${ok.join(", ")}` : "NO enviado por ningún canal");
process.exit(ok.length ? 0 : 1);
