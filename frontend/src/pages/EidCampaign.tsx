import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const TIERS = [
  { key: "seventh", amount: 3000, labelKey: "eid.donate_seventh" },
  { key: "half", amount: 10000, labelKey: "eid.donate_half" },
  { key: "full", amount: 20000, labelKey: "eid.donate_full" },
];

const EID_CAMPAIGN_ID = "00000000-0000-0000-0000-000000000001"; // replace with real ID

export default function EidCampaign() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const goal = 3_000_000; // $30,000 in cents
  const raised = 1_740_000; // $17,400 in cents
  const progress = Math.min((raised / goal) * 100, 100);

  const handleDonate = (amount: number) => {
    navigate(`/donate?campaign=${EID_CAMPAIGN_ID}&amount=${amount}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-900 to-forest-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 text-gold-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            {t("eid.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("eid.title")}</h1>
          <p className="text-forest-200 text-lg max-w-xl mx-auto">{t("eid.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="grid grid-cols-3 gap-6 mb-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">$17,400</div>
              <div className="text-sm text-gray-500 mt-0.5">{t("eid.raised_of_goal")} $30,000</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <div className="text-sm text-gray-500 mt-0.5">{t("eid.donors")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500 mt-0.5">{t("eid.days_left")}</div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-forest-600 to-forest-500 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right rtl:text-left mt-2 text-sm text-gray-500 font-medium">
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Donation tiers */}
        <h2 className="text-xl font-bold text-gray-900 mb-5">{t("eid.cta")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {TIERS.map((tier) => (
            <button
              key={tier.key}
              onClick={() => { setSelectedTier(tier.key); handleDonate(tier.amount); }}
              className={`border-2 rounded-2xl p-6 text-left rtl:text-right transition-all hover:border-forest-400 hover:shadow-md ${
                selectedTier === tier.key
                  ? "border-forest-600 bg-forest-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="text-2xl font-bold text-forest-800 mb-1">
                ${tier.amount / 100}
              </div>
              <div className="text-sm font-medium text-gray-700">
                {t(tier.labelKey)}
              </div>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="text-center mb-10">
          <Link
            to={`/donate?campaign=${EID_CAMPAIGN_ID}`}
            className="text-sm text-forest-700 hover:text-forest-900 font-medium underline underline-offset-2"
          >
            {t("eid.custom_amount")}
          </Link>
        </div>

        {/* Guarantee */}
        <div className="flex items-start gap-4 bg-gold-50 border border-gold-100 rounded-2xl p-6">
          <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">{t("eid.guarantee")}</p>
            <p className="text-sm text-gray-600">{t("eid.countries")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
