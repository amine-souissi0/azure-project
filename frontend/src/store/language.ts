import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../lib/i18n";

export type Language = "en" | "ar" | "fr";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    { name: "language-storage" }
  )
);
