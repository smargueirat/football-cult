"use client";

import PriceAlertInline from "./PriceAlertInline";
import { CONV } from "@/lib/convStrings";
import { botDeepLink } from "@/lib/telegramBot";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CHANNEL = "https://t.me/FootballCultOfertas";
const pill =
  "inline-flex min-h-11 items-center rounded-full border border-[#1B3B2B]/30 bg-white px-4 py-2 text-sm font-medium text-[#1B3B2B] transition-colors hover:border-[#1B3B2B]";

// Captura de vuelta, al final de la lista de ofertas: quien no compra hoy
// deja un correo (doble opt-in, /api/price-alerts) o sigue a su equipo en
// el bot de Telegram (@FootballCultBot, webhook activo desde 2026-10-02) o
// el canal de bajadas. Antes eran dos enlaces de 12-14 px junto a la foto.
export default function ReturnCapture({ productId, team }: { productId: string; team?: { key: string; name: string } }) {
  const { locale } = useLanguage();
  const c = CONV[locale];
  return (
    <div className="mt-6 rounded-2xl border border-[#C9A24B]/50 bg-[#fffaf0] p-4" data-testid="return-capture">
      <p className="font-semibold text-[#1B3B2B]">{c.alertTitle}</p>
      <p className="mt-0.5 text-xs text-[#675c44]">{c.alertBody}</p>
      <PriceAlertInline productId={productId} prominent />
      <div className="mt-3 flex flex-wrap gap-2">
        {team && (
          <a href={botDeepLink(team.key)} target="_blank" rel="nofollow noopener noreferrer" className={pill}>
            {c.tgTeam.replace("{team}", team.name)}
          </a>
        )}
        <a href={CHANNEL} target="_blank" rel="noopener noreferrer" className={pill}>
          {c.tgChannel}
        </a>
      </div>
    </div>
  );
}
