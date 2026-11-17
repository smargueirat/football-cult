"use client";

import type { SlimGearItem } from "@/lib/gearList";
import ApparelListClient from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TRAINING_TYPES } from "@/lib/trainingTypes";

export default function EntrenamientoPageClient({ items }: { items: SlimGearItem[] }) {
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={items}
      pageTitle={t.entrenamiento.pageTitle}
      pageSubtitle={t.entrenamiento.pageSubtitle}
      types={TRAINING_TYPES}
      typeLabel={(ty) => t.entrenamiento.types[ty as keyof typeof t.entrenamiento.types] ?? ty}
      typeFilterLabel={t.entrenamiento.typeLabel}
      basePath="entrenamiento"
    />
  );
}
