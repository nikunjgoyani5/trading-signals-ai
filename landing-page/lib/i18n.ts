"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/common.json";
import pl from "@/locales/pl/common.json";
import th from "@/locales/th/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
    th: { translation: th },
  },
  lng: "en", // Set default language to match server render
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Update localStorage when language changes
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("i18nextLng", lng);
  }
});

export default i18n;
