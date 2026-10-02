import fs from "node:fs";
import path from "node:path";

// Quién sigue a qué equipo en Telegram.
//
// Vive en disco FUERA del repo (junto a los clics, en /home/piojo/fc-data):
// el repo es público y esto son ids de chat de personas. Se guarda lo mínimo
// -- chat_id y teamKeys, nada de nombres ni usernames.
//
// Lo escribe el webhook (proceso del sitio) y lo lee/limpia el envío nocturno
// (otro proceso). Cada escritura relee el archivo justo antes y lo reemplaza
// de forma atómica (tmp + rename), así que ninguno ve un JSON a medias; la
// ventana de pisarse entre procesos es de milisegundos y el peor caso es
// perder un alta, que el usuario repite con /seguir.

export type Followers = Record<string, string[]>;

/** Tope de equipos por chat: sin esto un solo chat podría inflar el archivo. */
export const MAX_TEAMS_PER_CHAT = 30;

export function dataDir(): string {
  return process.env.FC_DATA_DIR || "/home/piojo/fc-data";
}

export function followersPath(): string {
  return path.join(dataDir(), "telegram_followers.json");
}

export function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonAtomic(file: string, data: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data) + "\n");
  fs.renameSync(tmp, file);
}

export function readFollowers(): Followers {
  return readJson<Followers>(followersPath(), {});
}

function update(fn: (all: Followers) => void): void {
  const all = readFollowers();
  fn(all);
  writeJsonAtomic(followersPath(), all);
}

/** Devuelve false si el chat ya llegó al tope de equipos. */
export function follow(chatId: string, teamKey: string): boolean {
  let ok = true;
  update((all) => {
    const list = all[chatId] ?? [];
    if (list.includes(teamKey)) return;
    if (list.length >= MAX_TEAMS_PER_CHAT) {
      ok = false;
      return;
    }
    all[chatId] = [...list, teamKey];
  });
  return ok;
}

export function unfollow(chatId: string, teamKey: string): void {
  update((all) => {
    const left = (all[chatId] ?? []).filter((k) => k !== teamKey);
    if (left.length) all[chatId] = left;
    else delete all[chatId];
  });
}

/** /stop, o el bot fue bloqueado: se borra todo rastro del chat. */
export function removeChat(chatId: string): void {
  update((all) => {
    delete all[chatId];
  });
}

export function teamsOf(chatId: string): string[] {
  return readFollowers()[chatId] ?? [];
}
