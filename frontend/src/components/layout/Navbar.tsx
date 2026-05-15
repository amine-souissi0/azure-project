import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useLanguageStore, type Language } from "../../store/language";
import { useThemeStore } from "../../store/theme";
import { authApi } from "../../lib/api";

const LANG_LABELS: Record<Language, string> = { en: "EN", ar: "عر", fr: "FR" };
const LANGS: Language[] = ["en", "ar", "fr"];

function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authApi.logout().catch(() => {});
    clearAuth();
  };

  const navLinks = [
    { to: "/articles", label: t("nav.articles") },
    { to: "/qa", label: t("nav.ask") },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-forest-800 dark:text-forest-400">
            <div className="w-8 h-8 bg-forest-800 dark:bg-forest-700 rounded-lg flex items-center justify-center text-white">
              <Logo />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Dawah</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-forest-50 dark:bg-forest-900/50 text-forest-800 dark:text-forest-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                {LANG_LABELS[language]}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 w-28 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  {LANGS.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`w-full text-left rtl:text-right px-3 py-2.5 text-sm font-medium transition-colors ${
                        language === lang
                          ? "bg-forest-50 dark:bg-forest-900/50 text-forest-800 dark:text-forest-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {LANG_LABELS[lang]} — {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.name.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  {t("nav.logout")}
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-forest-50 dark:bg-forest-900/50 text-forest-800 dark:text-forest-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
