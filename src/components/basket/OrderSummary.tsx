"use client";

import { useTranslations } from "next-intl";
import PromoCodeSection from "@/components/basket/PromoCodeSection";
import Link from "next/link";

interface OrderSummaryProps {
  selectedItemsCount: number;
  selectedItemsTotal: number;
  promoCode: string;
  promoApplied: boolean;
  promoDiscount: number;
  discountAmount: number;
  finalTotal: number;
  onCancelPromo: () => void;
  onCheckPromocode: (code: string) => void;
  isCheckingPromocode?: boolean;
}

export default function OrderSummary({
  selectedItemsCount,
  selectedItemsTotal,
  promoCode,
  promoApplied,
  promoDiscount,
  discountAmount,
  finalTotal,
  onCancelPromo,
  onCheckPromocode,
  isCheckingPromocode = false,
}: OrderSummaryProps) {
  const t = useTranslations("basket");

  return (
    <div className="w-full lg:w-[400px] shrink-0">
      <div className="bg-white border border-[#F3F2F8] rounded-[2px] p-6 sticky top-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg text-black">{t("title")}</h2>
          <span className="text-sm text-[#85858C]">
            {selectedItemsCount} {t("products")}
          </span>
        </div>

        {/* Promo Code Section */}
        <PromoCodeSection
          promoCode={promoCode}
          promoApplied={promoApplied}
          promoDiscount={promoDiscount}
          onCancelPromo={onCancelPromo}
          onCheckPromocode={onCheckPromocode}
          isChecking={isCheckingPromocode}
        />

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E5EA]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#85858C]">
              {t("productPrice")}
            </span>
            <span className="text-sm text-black">
              {selectedItemsTotal.toFixed(2)} ₼
            </span>
          </div>

          {promoApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#85858C]">
                {t("discount")}
              </span>
              <span className="text-sm text-blue-600">
                -{discountAmount.toFixed(2)} ₼
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-semibold text-base text-black">
              {t("totalPrice")}
            </span>
            <span className="font-semibold text-lg text-black">
              {finalTotal.toFixed(2)} ₼
            </span>
          </div>
        </div>

        <Link href="/confirm" className="w-full bg-black text-white font-medium text-base py-3 md:py-4 px-6 flex items-center justify-center gap-2 transition-colors hover:bg-black/90">
          {t("completeOrder")}
        </Link>
      </div>
    </div>
  );
}
