// Username público del bot que atiende los avisos por equipo (el mismo que
// publica en @FootballCultOfertas). Sale de getMe; la env solo sirve para
// cambiarlo sin tocar código.
const DEFAULT_BOT = "FootballCultBot";

export function botDeepLink(teamKey: string): string {
  const bot = process.env.TELEGRAM_BOT_USERNAME || DEFAULT_BOT;
  return `https://t.me/${bot}?start=equipo_${teamKey}`;
}
