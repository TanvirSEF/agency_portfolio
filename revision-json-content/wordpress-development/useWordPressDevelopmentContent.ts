"use client";

import { useLocale } from "next-intl";
import enContent from "./en.json";
import svContent from "./sv.json";

export type WordPressDevelopmentContent = typeof enContent;

const contentMap: Record<string, WordPressDevelopmentContent> = {
  en: enContent,
  sv: svContent,
};

export function useWordPressDevelopmentContent(): WordPressDevelopmentContent {
  let locale = "en";
  try {
    locale = useLocale();
  } catch {
    // fallback to English when not inside NextIntlClientProvider
  }
  return contentMap[locale] ?? enContent;
}
