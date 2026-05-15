import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "../locales/ar.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

const stored = localStorage.getItem("language-storage");
const savedLang = stored ? (JSON.parse(stored)?.state?.language ?? "en") : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
