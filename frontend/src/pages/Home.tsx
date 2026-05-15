import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "../lib/api";

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  riba: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  halal_finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  sadaqah: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  eid: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  tips: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  general: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 rtl:rotate-180 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FinanceCard({
  tag,
  tagColor,
  icon,
  title,
  desc,
}: {
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-forest-50 dark:bg-forest-900/40 rounded-xl flex items-center justify-center text-forest-700 dark:text-forest-400">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left rtl:text-right py-5 flex items-center justify-between gap-4 group"
      >
        <span className="font-medium text-gray-900 dark:text-white group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-slide-up">
          {answer}
        </p>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar" | "fr";

  const { data: articles } = useQuery({
    queryKey: ["articles", "home"],
    queryFn: () => articlesApi.list({ limit: 3 }).then((r) => r.data),
  });

  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`faq.q${n}`),
    a: t(`faq.a${n}`),
  }));

  return (
    <div className="animate-fade-in">

      {/* ── 1. Hero ───────────────────────────────────────────────────── */}
      <section className="relative bg-forest-900 dark:bg-gray-950 text-white overflow-hidden">
        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-forest-950/50 dark:from-gray-950/80 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-gold-300 font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" aria-hidden />
              {t("hero.badge")}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight mb-6">
              <span className="block">{t("hero.title_line1")}</span>
              <span className="block text-gold-300">{t("hero.title_line2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-forest-200 mb-10 max-w-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 bg-white text-forest-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-forest-50 transition-colors"
              >
                {t("hero.cta_learn")} <ArrowRight />
              </Link>
              <Link
                to="/qa"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/15 transition-colors"
              >
                {t("hero.cta_ask")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 gap-6 divide-x divide-gray-100 dark:divide-gray-800 rtl:divide-x-reverse">
            {[
              { value: "7+", label: t("stats.articles") },
              { value: "24/7", label: t("stats.questions") },
            ].map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-forest-800 dark:text-forest-400">{s.value}</div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Halal Finance Cards ────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("finance.section_title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t("finance.section_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FinanceCard
              tag={t("finance.riba_tag")}
              tagColor="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
              title={t("finance.riba_title")}
              desc={t("finance.riba_desc")}
            />
            <FinanceCard
              tag={t("finance.alt_tag")}
              tagColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title={t("finance.alt_title")}
              desc={t("finance.alt_desc")}
            />
            <FinanceCard
              tag={t("finance.daily_tag")}
              tagColor="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title={t("finance.daily_title")}
              desc={t("finance.daily_desc")}
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-forest-700 dark:text-forest-400 font-semibold hover:text-forest-900 dark:hover:text-forest-300 transition-colors"
            >
              {t("articles.view_all")} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. AI Assistant ───────────────────────────────────────────── */}
      <section className="bg-forest-800 dark:bg-forest-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("ai_section.title")}</h2>
              <p className="text-forest-200 mb-6">{t("ai_section.subtitle")}</p>

              <p className="text-sm font-semibold text-forest-300 mb-3">{t("ai_section.can_help_title")}</p>
              <ul className="space-y-2.5 mb-8">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-center gap-2.5 text-forest-100 text-sm">
                    <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd" />
                    </svg>
                    {t(`ai_section.can_help_${n}`)}
                  </li>
                ))}
              </ul>

              {/* Disclaimer — always visible */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-forest-200">{t("ai_section.disclaimer")}</p>
              </div>

              <Link
                to="/qa"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                {t("ai_section.cta")} <ArrowRight />
              </Link>
            </div>

            {/* Chat preview */}
            <div className="bg-forest-900/60 dark:bg-black/40 rounded-2xl border border-forest-700 dark:border-gray-800 overflow-hidden">
              <div className="border-b border-forest-700 dark:border-gray-800 px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="ml-2 text-xs text-forest-400">Halal Finance Advisor</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-forest-600 flex-shrink-0" />
                  <div className="bg-forest-700/60 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-forest-100 max-w-xs">
                    Is it okay to use a credit card if I always pay it off in full?
                  </div>
                </div>
                <div className="flex gap-3 justify-end rtl:justify-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-forest-100 max-w-xs rtl:rounded-tr-2xl rtl:rounded-tl-sm">
                    Yes — if you consistently pay the full balance monthly and never incur interest, most contemporary scholars consider this permissible. The key is discipline and firm intention. ✓
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gold-600/70 flex-shrink-0 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    AI
                  </div>
                </div>
                <div className="flex gap-3 opacity-50">
                  <div className="w-7 h-7 rounded-full bg-forest-600 flex-shrink-0" />
                  <div className="bg-forest-700/40 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-forest-200 max-w-xs">
                    What about halal mortgages in France?
                  </div>
                </div>
              </div>
              <div className="border-t border-forest-700 dark:border-gray-800 px-4 py-3">
                <div className="bg-forest-700/30 rounded-xl px-4 py-2.5 text-sm text-forest-400">
                  Ask a question...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Latest Articles ───────────────────────────────────────── */}
      {articles && articles.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("articles.title")}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{t("articles.subtitle")}</p>
              </div>
              <Link
                to="/articles"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-forest-700 dark:text-forest-400 hover:text-forest-900 dark:hover:text-forest-300 transition-colors rtl:flex-row-reverse"
              >
                {t("articles.view_all")} <ArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {articles.map(
                (a: {
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
                  const title = (lang === "ar" ? a.title_ar : lang === "fr" ? a.title_fr : null) ?? a.title_en;
                  const excerpt = (lang === "ar" ? a.excerpt_ar : lang === "fr" ? a.excerpt_fr : null) ?? a.excerpt_en;
                  return (
                    <Link
                      key={a.id}
                      to={`/articles/${a.slug}`}
                      className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-forest-200 dark:hover:border-forest-800 hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[a.category] ?? CATEGORY_COLORS.general}`}>
                          {t(`articles.categories.${a.category}`)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          {a.read_time_minutes} {t("articles.min_read")}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-forest-800 dark:group-hover:text-forest-400 transition-colors leading-snug flex-1">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
                      )}
                      <div className="mt-auto flex items-center gap-1 text-forest-700 dark:text-forest-400 text-sm font-medium">
                        {t("articles.read_more")}
                        <ArrowRight className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t("faq.title")}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t("faq.subtitle")}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 md:px-8 shadow-sm">
            {faqs.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 dark:text-gray-600 mt-6">
            {t("footer.disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}
