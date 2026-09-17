"use client";

import type { GloveProduct } from "@/data/gloves";
import GearDetailClient from "@/components/GearDetailClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GloveDetailPageClient({ glove }: { glove: GloveProduct }) {
  const { t } = useLanguage();
  return <GearDetailClient item={glove} basePath="guantes" sizeLabel={t.guantes.sizeLabel} />;
}
