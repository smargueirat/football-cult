"use client";

import { ballProducts } from "@/data/balls";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PelotasPageClient() {
  const { t } = useLanguage();
  return (
    <GearListClient
      items={ballProducts}
      basePath="pelotas"
      pageTitle={t.pelotas.pageTitle}
      pageSubtitle={t.pelotas.pageSubtitle}
    />
  );
}
