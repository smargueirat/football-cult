// Registra (o consulta) el webhook del bot de Telegram.
//
//   npx tsx scripts/catalog-mining/set_telegram_webhook.mts          # registra
//   npx tsx scripts/catalog-mining/set_telegram_webhook.mts --info   # solo muestra el estado
//   npx tsx scripts/catalog-mining/set_telegram_webhook.mts --delete # lo quita
//
// Ejecutar UNA vez, DESPUÉS de desplegar /api/telegram/webhook y de tener
// TELEGRAM_WEBHOOK_SECRET en .env.local (el mismo valor que lee el sitio).
// Mientras hay webhook, Telegram no entrega nada por getUpdates: si otro
// proceso usa este mismo bot con getUpdates, dejará de recibir mensajes.
import fs from "node:fs";
import path from "node:path";

const WEBHOOK_URL = "https://football-cult.com/api/telegram/webhook";

const envFile = path.join(import.meta.dirname, "../../.env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
    const m = /^(TELEGRAM_BOT_TOKEN|TELEGRAM_WEBHOOK_SECRET)=(.+)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const mode = process.argv[2];

if (!token) throw new Error("Falta TELEGRAM_BOT_TOKEN (ver .env.local)");

async function call(method: string, body?: object) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return res.json();
}

if (mode === "--info") {
  const r = await call("getWebhookInfo");
  // Sin imprimir nada sensible: solo url, pendientes y último error.
  console.log({
    url: r.result?.url,
    pending: r.result?.pending_update_count,
    lastError: r.result?.last_error_message,
  });
} else if (mode === "--delete") {
  console.log(await call("deleteWebhook"));
} else {
  if (!secret) throw new Error("Falta TELEGRAM_WEBHOOK_SECRET (ver .env.local)");
  const r = await call("setWebhook", {
    url: WEBHOOK_URL,
    secret_token: secret,
    allowed_updates: ["message"],
  });
  console.log(r.ok ? `Webhook registrado en ${WEBHOOK_URL}` : r);
}
