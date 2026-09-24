"use client";

import { trainingProducts } from "@/data/training";
import ApparelListClient from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TRAINING_TYPES } from "@/lib/trainingTypes";

export default function EntrenamientoPageClient() {
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={trainingProducts}
      pageTitle={t.entrenamiento.pageTitle}
      pageSubtitle={t.entrenamiento.pageSubtitle}
      types={TRAINING_TYPES}
      typeLabel={(ty) => t.entrenamiento.types[ty as keyof typeof t.entrenamiento.types] ?? ty}
      typeFilterLabel={t.entrenamiento.typeLabel}
      basePath="entrenamiento"
    />
  );
}
