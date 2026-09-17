"use client";

import { gloveProducts } from "@/data/gloves";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GuantesPageClient() {
  const { t } = useLanguage();
  return (
    <GearListClient
      items={gloveProducts}
      basePath="guantes"
      pageTitle={t.guantes.pageTitle}
      pageSubtitle={t.guantes.pageSubtitle}
    />
  );
}
