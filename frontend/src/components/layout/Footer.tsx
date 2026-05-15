import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function StarMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-forest-950 dark:bg-black text-forest-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
                <StarMark />
              </div>
              <span className="font-bold text-white text-lg">Dawah</span>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed max-w-xs mb-4">
              {t("footer.tagline")}
            </p>
            <p className="text-forest-500 text-xs leading-relaxed max-w-xs">
              {t("footer.disclaimer")}
            </p>
          </div>

          {/* Learn */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">{t("footer.learn")}</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/articles?category=riba", label: "Riba & Interest" },
                { to: "/articles?category=halal_finance", label: "Halal Finance" },
                { to: "/articles?category=sadaqah", label: "Sadaqah" },
                { to: "/qa", label: t("nav.ask") },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-forest-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-900 dark:border-gray-900">
          <p className="text-forest-500 text-xs">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
