import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { donationsApi } from "../lib/api";

const PRESET_AMOUNTS = [30, 50, 100, 200, 500];

export default function Donate() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialAmount = Number(searchParams.get("amount") ?? 0) / 100 || 50;
  const initialCampaignId = searchParams.get("campaign") ?? "";

  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(!PRESET_AMOUNTS.includes(initialAmount));
  const [campaignId, setCampaignId] = useState(initialCampaignId);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => donationsApi.campaigns().then((r) => r.data),
  });

  const effectiveAmount = isCustom ? Number(customAmount) || 0 : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 1) return;
    if (!campaignId && campaigns?.length > 0) {
      setError("Please select a campaign");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await donationsApi.checkout({
        campaign_id: campaignId || campaigns?.[0]?.id,
        amount: Math.round(effectiveAmount * 100),
        donor_name: anonymous ? undefined : donorName || undefined,
        donor_email: donorEmail || undefined,
      });
      // Redirect to Stripe checkout
      window.location.href = res.data.checkout_url;
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("donate.title")}</h1>
          <p className="text-gray-500">{t("donate.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          {/* Campaign selector */}
          {Array.isArray(campaigns) && campaigns.length > 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("donate.select_campaign")}
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
              >
                {Array.isArray(campaigns) && campaigns.map(
                  (c: { id: string; name_en: string }) => (
                    <option key={c.id} value={c.id}>{c.name_en}</option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t("donate.amount_label")}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setIsCustom(false); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    !isCustom && amount === a
                      ? "border-forest-600 bg-forest-50 text-forest-800"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  ${a}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  isCustom
                    ? "border-forest-600 bg-forest-50 text-forest-800"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t("donate.custom")}
              </button>
            </div>
            {isCustom && (
              <div className="relative">
                <span className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-xl pl-8 rtl:pl-4 rtl:pr-8 pr-4 py-3 text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                />
              </div>
            )}
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAnonymous(!anonymous)}
              className={`w-10 h-6 rounded-full transition-colors relative ${anonymous ? "bg-forest-700" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  anonymous ? "translate-x-5 rtl:-translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm text-gray-600 cursor-pointer" onClick={() => setAnonymous(!anonymous)}>
              {t("donate.anonymous")}
            </label>
          </div>

          {/* Donor info */}
          {!anonymous && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("donate.name_label")}
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={t("donate.name_placeholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("donate.email_label")}
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder={t("donate.email_placeholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading || effectiveAmount < 1}
            className="w-full bg-forest-800 text-white font-semibold py-4 rounded-xl hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t("donate.pay_button")}
                {effectiveAmount > 0 && <span>· ${effectiveAmount}</span>}
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t("donate.secure_note")}
          </p>
        </form>
      </div>
    </div>
  );
}
