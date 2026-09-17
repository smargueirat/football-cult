"use client";

import type { BallProduct } from "@/data/balls";
import GearDetailClient from "@/components/GearDetailClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BallDetailPageClient({ ball }: { ball: BallProduct }) {
  const { t } = useLanguage();
  return <GearDetailClient item={ball} basePath="pelotas" sizeLabel={t.pelotas.sizeLabel} />;
}
