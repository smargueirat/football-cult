import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { teamNames } from "@/lib/productMeta";
import { follow, removeChat, teamsOf, unfollow, MAX_TEAMS_PER_CHAT } from "@/lib/telegramFollowers";

// Webhook del bot: cada visitante sigue a SU equipo y el envío nocturno
// (scripts/catalog-mining/broadcast_price_drops.mts) le escribe en privado
// cuando baja una camiseta de ese equipo.
//
// Telegram reintenta mientras no reciba 200, así que una vez validado el
// secreto SIEMPRE se responde 200, aunque el comando sea basura o el envío
// de la respuesta falle: un reintento no arreglaría nada y solo duplicaría
// mensajes.

const SITE = "https://football-cult.com/es";
const MAX_BODY = 64 * 1024;

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Índice nombre-normalizado -> teamKeys, con los nombres de los 5 idiomas y
// la propia clave, para que "/seguir Bayern", "/seguir fcbayern" y
// "/seguir bayernmunchen" lleguen al mismo sitio.
let index: [string, string[]][] | null = null;
function teamIndex(): [string, string[]][] {
  if (index) return index;
  const m = new Map<string, Set<string>>();
  const add = (name: string, key: string) => {
    const n = norm(name);
    if (n) m.set(n, (m.get(n) ?? new Set()).add(key));
  };
  for (const [key, names] of Object.entries(teamNames)) {
    add(key, key);
    for (const n of Object.values(names)) add(n, key);
  }
  index = [...m].map(([n, keys]) => [n, [...keys]]);
  return index;
}

const isTeamKey = (k: string) => Object.hasOwn(teamNames, k);
const nameOf = (k: string) => teamNames[k as keyof typeof teamNames]?.es ?? k;

type Resolved = { key: string } | { options: string[] };

function resolveTeam(query: string): Resolved {
  const q = norm(query);
  if (q.length < 2) return { options: [] };
  const entries = teamIndex();
  const exact = entries.find(([n]) => n === q);
  if (exact && exact[1].length === 1) return { key: exact[1][0] };
  const keys = new Set<string>();
  for (const [n, ks] of entries) if (exact ? n === q : n.includes(q)) ks.forEach((k) => keys.add(k));
  if (keys.size === 1) return { key: [...keys][0] };
  return { options: [...keys] };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const HELP = [
  "⚽ <b>Avisos de bajadas de precio por equipo</b>",
  "",
  "Te escribo cuando baje el precio de una camiseta de tu equipo.",
  "",
  "/seguir &lt;equipo&gt; — empezar a seguir un equipo",
  "/dejar &lt;equipo&gt; — dejar de seguirlo",
  "/mis — ver tus equipos",
  "/stop — borrar todo y no recibir más avisos",
  "",
  `También puedes elegirlo desde la página de tu equipo en ${SITE.replace("/es", "")}.`,
].join("\n");

async function reply(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Sin reintento: ver la nota de arriba.
  }
}

function followMsg(chatId: string, key: string): string {
  if (!follow(chatId, key)) {
    return `Ya sigues ${MAX_TEAMS_PER_CHAT} equipos, que es el máximo. Deja alguno con /dejar &lt;equipo&gt; y vuelve a intentarlo.`;
  }
  return `✅ Listo, sigues a <b>${esc(nameOf(key))}</b>. Te aviso aquí cuando baje el precio de una de sus camisetas.\n\n${SITE}/equipo/${key}`;
}

function notFoundMsg(r: { options: string[] }, verb: string): string {
  if (!r.options.length) return `No encontré ese equipo. Prueba con el nombre completo: /${verb} FC Barcelona`;
  const list = r.options
    .slice(0, 5)
    .map((k) => `• ${esc(nameOf(k))}`)
    .join("\n");
  return `Hay varios equipos que coinciden, escribe el nombre completo:\n${list}`;
}

async function handle(chatId: string, text: string): Promise<void> {
  const m = /^\/(\w+)(?:@\w+)?(?:\s+([\s\S]*))?$/.exec(text.trim());
  if (!m) return reply(chatId, HELP);
  const cmd = m[1].toLowerCase();
  const arg = (m[2] ?? "").trim();

  switch (cmd) {
    case "start": {
      const payload = /^equipo_([A-Za-z0-9_-]{1,64})$/.exec(arg);
      if (payload && isTeamKey(payload[1])) return reply(chatId, followMsg(chatId, payload[1]));
      return reply(chatId, HELP);
    }
    case "seguir":
    case "dejar": {
      if (!arg) return reply(chatId, `Dime el equipo: /${cmd} FC Barcelona`);
      const r = resolveTeam(arg);
      if (!("key" in r)) return reply(chatId, notFoundMsg(r, cmd));
      if (cmd === "seguir") return reply(chatId, followMsg(chatId, r.key));
      unfollow(chatId, r.key);
      return reply(chatId, `Dejaste de seguir a <b>${esc(nameOf(r.key))}</b>.`);
    }
    case "mis": {
      const keys = teamsOf(chatId);
      if (!keys.length) return reply(chatId, "Aún no sigues ningún equipo. Prueba con /seguir FC Barcelona");
      return reply(chatId, `Sigues a:\n${keys.map((k) => `• ${esc(nameOf(k))}`).join("\n")}`);
    }
    case "stop": {
      removeChat(chatId);
      return reply(chatId, "Hecho: borré tus equipos y no recibirás más avisos. Puedes volver con /seguir cuando quieras.");
    }
    default:
      return reply(chatId, HELP);
  }
}

// Comparación a tiempo constante sobre hashes (misma longitud siempre).
function secretMatches(got: string | null, want: string): boolean {
  if (!got) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(got), h(want));
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  // Sin secreto configurado se rechaza todo: un webhook abierto dejaría que
  // cualquiera fabricara altas.
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 403 });
  if (!secretMatches(req.headers.get("x-telegram-bot-api-secret-token"), secret)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return NextResponse.json({ ok: true });
    const update = await req.json();
    const msg = update?.message;
    // Solo chats privados con texto: el bot no atiende grupos.
    if (msg?.chat?.type === "private" && typeof msg.text === "string" && typeof msg.chat.id === "number") {
      await handle(String(msg.chat.id), msg.text.slice(0, 300));
    }
  } catch {
    // JSON inválido o fallo de disco: 200 igualmente (ver la nota de arriba).
  }
  return NextResponse.json({ ok: true });
}
