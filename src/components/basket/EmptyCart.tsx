"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function EmptyCart() {
  const t = useTranslations("basket");

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="mb-4 sm:mb-6">
        <Image
          src="/icons/empty_bag.svg"
          alt="Empty basket"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
      </div>

      <p className="text-base sm:text-lg text-black mb-8 sm:mb-10">
        {t("empty")}
      </p>

      <div className="w-full border-b border-[#E5E5EA]" />
    </div>
  );
}
