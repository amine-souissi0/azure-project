import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "../lib/api";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar" | "fr";

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articlesApi.get(slug!).then((r) => r.data),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-64 bg-gray-100 rounded mt-8" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500 mb-4">{t("common.error")}</p>
        <Link to="/articles" className="text-forest-700 font-medium hover:underline">
          ← {t("common.back")}
        </Link>
      </div>
    );
  }

  const title =
    (lang === "ar" ? article.title_ar : lang === "fr" ? article.title_fr : null) ?? article.title_en;
  const body =
    (lang === "ar" ? article.body_ar : lang === "fr" ? article.body_fr : null) ?? article.body_en;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <Link
        to="/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors rtl:flex-row-reverse"
      >
        <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        {t("common.back")}
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-semibold bg-forest-100 text-forest-700 px-2.5 py-1 rounded-full">
          {t(`articles.categories.${article.category}`)}
        </span>
        <span className="text-xs text-gray-400">
          {article.read_time_minutes} {t("articles.min_read")}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(article.created_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-8">{title}</h1>

      <article
        className="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-forest-700"
        style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
      >
        {/* Render body as plain text — swap for markdown renderer when ready */}
        {body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
    </div>
  );
}
