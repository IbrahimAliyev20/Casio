"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface BasketHeaderProps {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onRemoveSelected: () => void;
}

export default function BasketHeader({
  allSelected,
  onSelectAll,
  onRemoveSelected,
}: BasketHeaderProps) {
  const t = useTranslations("basket");

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          id="select-all"
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium text-black cursor-pointer"
        >
          {t("selectAll")}
        </label>
      </div>
      <button
        onClick={onRemoveSelected}
        className="p-2 hover:bg-gray-50 rounded-sm transition-colors"
        aria-label="Remove selected"
      >
        <Trash2 className="size-4 text-[#85858C]" />
      </button>
    </div>
  );
}
