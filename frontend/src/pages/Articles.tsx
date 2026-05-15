import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "../lib/api";

const CATEGORIES = ["all", "riba", "halal_finance", "sadaqah", "eid", "tips", "general"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  riba: "bg-rose-100 text-rose-700",
  halal_finance: "bg-emerald-100 text-emerald-700",
  sadaqah: "bg-blue-100 text-blue-700",
  eid: "bg-amber-100 text-amber-700",
  tips: "bg-purple-100 text-purple-700",
  general: "bg-gray-100 text-gray-600",
};

export default function Articles() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const lang = i18n.language as "en" | "ar" | "fr";

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", category],
    queryFn: () =>
      articlesApi
        .list({ category: category === "all" ? undefined : category, limit: 20 })
        .then((r) => r.data),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("articles.title")}</h1>
        <p className="text-gray-500">{t("articles.subtitle")}</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              category === cat
                ? "bg-forest-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t(`articles.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(
            (article: {
              id: string;
              slug: string;
              title_en: string;
              title_ar: string | null;
              title_fr: string | null;
              excerpt_en: string | null;
              excerpt_ar: string | null;
              excerpt_fr: string | null;
              category: string;
              read_time_minutes: number;
              created_at: string;
            }) => {
              const title =
                (lang === "ar" ? article.title_ar : lang === "fr" ? article.title_fr : null) ??
                article.title_en;
              const excerpt =
                (lang === "ar" ? article.excerpt_ar : lang === "fr" ? article.excerpt_fr : null) ??
                article.excerpt_en;
              return (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-forest-200 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.general
                      }`}
                    >
                      {t(`articles.categories.${article.category}`)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {article.read_time_minutes} {t("articles.min_read")}
                    </span>
                  </div>
                  <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-forest-800 transition-colors leading-snug flex-1">
                    {title}
                  </h2>
                  {excerpt && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
                  )}
                  <div className="flex items-center gap-1 text-forest-700 text-sm font-medium mt-auto">
                    {t("articles.read_more")}
                    <svg className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>{t("articles.empty")}</p>
        </div>
      )}
    </div>
  );
}
