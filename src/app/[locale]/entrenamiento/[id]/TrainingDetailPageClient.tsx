"use client";

import type { TrainingProduct } from "@/data/training";
import GearDetailClient from "@/components/GearDetailClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrainingDetailPageClient({ item }: { item: TrainingProduct }) {
  const { t } = useLanguage();
  return <GearDetailClient item={item} basePath="entrenamiento" sizeLabel={t.search.sizeLabel} />;
}
