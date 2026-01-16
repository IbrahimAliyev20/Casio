"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface PromoCodeSectionProps {
  promoCode: string;
  promoApplied: boolean;
  promoDiscount: number;
  onCancelPromo: () => void;
  onCheckPromocode: (code: string) => void;
  isChecking?: boolean;
}

export default function PromoCodeSection({
  promoCode,
  promoApplied,
  promoDiscount,
  onCancelPromo,
  onCheckPromocode,
  isChecking = false,
}: PromoCodeSectionProps) {
  const t = useTranslations("basket");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCheckPromocode(inputValue.trim());
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-black mb-1">
        {t("promoCode")}
      </label>
      <p className="text-xs text-[#85858C] mb-3">
        {t("promoCodeWarning")}
      </p>

      {promoCode ? (
        <div className="flex items-center border border-[#E5E5EA] rounded-sm overflow-hidden">
          <input
            type="text"
            value={promoCode}
            readOnly
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={onCancelPromo}
            className="px-4 py-2 text-sm text-[#85858C] hover:bg-gray-50 transition-colors border-l border-[#E5E5EA]"
          >
            {t("cancelPromo")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("promoCodePlaceholder")}
            className="flex-1 px-3 py-2 text-sm border border-[#E5E5EA] rounded-sm focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isChecking}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isChecking}
            className="px-4 py-2 text-sm bg-black text-white rounded-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isChecking ? t("checking") || "Checking..." : t("apply") || "Apply"}
          </button>
        </form>
      )}

      {promoApplied && promoCode && (
        <p className="text-sm text-blue-600 mt-2">
          {promoDiscount}% {t("promoCodeApplied")}
        </p>
      )}
    </div>
  );
}
