"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatOfferMoney, type OfferCurrencyCode } from "@/lib/offerMoney";
import type { OfferPriceStats } from "@/lib/priceArchive";

// "Mínimo registrado" y "precio actual vs mediana" de la mejor oferta, del
// archivo durable de precios. El servidor solo pasa `stats` cuando hay
// cobertura suficiente (>= 14 días): sin historial real no se muestra nada,
// ni un gráfico ni un porcentaje.
export default function PriceArchiveLine({ stats }: { stats: OfferPriceStats | null }) {
  const { t } = useLanguage();
  if (!stats) return null;
  const pct = Math.round(Math.abs(stats.vsMedianPct));
  const moved = stats.distinct > 1;
  return (
    <div className="mt-2 space-y-0.5 text-xs text-[#675c44]" data-testid="price-archive-line">
      {moved ? (
        <>
          <p>
            {t.detail.priceMinLine
              .replace("{days}", String(stats.coverageDays))
              .replace("{price}", formatOfferMoney(stats.min, stats.currency as OfferCurrencyCode))}
          </p>
          {pct >= 1 && (
            <p className="font-medium text-[#1B3B2B]">
              {(stats.vsMedianPct < 0 ? t.detail.priceBelowMedian : t.detail.priceAboveMedian).replace(
                "{pct}",
                String(pct),
              )}
            </p>
          )}
        </>
      ) : (
        <p>{t.detail.priceStable.replace("{days}", String(stats.daysAtCurrent))}</p>
      )}
    </div>
  );
}
