import { Offer, formatOfferMoney } from "@/data/products";

const WIDTH = 200;
const HEIGHT = 40;

export default function PriceHistorySparkline({
  history,
  currency,
  label,
}: {
  history: { date: string; price: number }[];
  currency: Offer["currency"];
  label: string;
}) {
  // Un solo punto (o ninguno) no dibuja una línea de nada -- no tiene
  // sentido mostrar el gráfico hasta que haya al menos 2 días de datos
  // reales acumulados por track_price_drops.py.
  if (history.length < 2) return null;

  const prices = history.map((h) => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const points = history
    .map((h, i) => {
      const x = (i / (history.length - 1)) * WIDTH;
      const y = HEIGHT - ((h.price - min) / span) * HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-[#C9A24B]/25 bg-white/60 p-3">
      <p className="text-xs text-[#5b5442]">{label}</p>
      <div className="flex items-center gap-3">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-10 w-32 flex-shrink-0" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="#1B3B2B" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="flex flex-col text-xs text-[#675c44]">
          <span>{formatOfferMoney(min, currency)} – {formatOfferMoney(max, currency)}</span>
        </div>
      </div>
    </div>
  );
}
