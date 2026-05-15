import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../store/theme";

export default function RTLProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const { theme } = useThemeStore();

  // Apply RTL direction and font on language change
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    document.documentElement.style.fontFamily = isRTL
      ? "'Cairo', 'Inter', sans-serif"
      : "'Inter', 'Cairo', sans-serif";
  }, [i18n.language]);

  // Apply dark class on theme change (also handles initial load from persisted store)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
