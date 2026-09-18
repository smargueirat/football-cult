"use client";

import { apparelProducts } from "@/data/apparel";
import ApparelListClient from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RopaPageClient() {
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={apparelProducts}
      pageTitle={t.ropa.pageTitle}
      pageSubtitle={t.ropa.pageSubtitle}
    />
  );
}
