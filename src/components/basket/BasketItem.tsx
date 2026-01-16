"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Plus, Minus, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { BasketItem } from "@/components/basket/types";
import { Input } from "../ui/input";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/services/wishlist/mutations";
import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { useLocale } from "next-intl";
import { Product } from "@/types";

interface BasketItemComponentProps {
  item: BasketItem;
  onSelect: (id: number, checked: boolean) => void;
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function BasketItemComponent({
  item,
  onSelect,
  onQuantityChange,
  onRemove,
}: BasketItemComponentProps) {
  const t = useTranslations("basket");
  const locale = useLocale();

  // Wishlist functionality
  const addToWishlistMutation = useAddToWishlistMutation();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();
  const { data: wishlistData } = useQuery(getWishlistQuery(locale));
  const wishlistItems = wishlistData?.data || [];
  const isInWishlist = wishlistItems.some((wishlistItem: Product) => wishlistItem.id === item.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(item.id);
    } else {
      addToWishlistMutation.mutate(item.id);
    }
  };

  return (
    <div className="bg-white border border-[#F3F2F8] rounded-[2px] p-4 flex gap-4 relative">
      {/* Checkbox */}
      <div className="flex items-start pt-1">
        <Checkbox
          checked={item.selected}
          onCheckedChange={(checked) => onSelect(item.id, checked === true)}
          id={`item-${item.id}`}
        />
      </div>

      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#FAFDFF] rounded-sm overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
          sizes="96px"
        />
      </div>

      {/* Product Details - Left aligned */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-base text-black mb-1">
            {item.title}
          </h3>
          <p className="text-sm text-[#85858C] mb-2">
            {item.quantity} {t("quantity")}
          </p>
          <span className="font-semibold text-lg text-black">
            {typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(String(item.price || 0)).toFixed(2)} ₼
          </span>
        </div>
      </div>

      {/* Interactive Controls - Right aligned */}
      <div className="flex flex-col justify-between items-end gap-2">
        {/* Action Icons - Top Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleWishlistToggle}
            className="p-2 hover:bg-gray-50 rounded-sm transition-colors"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
                  className={`size-2 sm:size-4 transition-colors ${
                    isInWishlist ? "fill-red-500 text-red-500" : "text-black"
                  }`}
                />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 hover:bg-gray-50 rounded-sm transition-colors"
            aria-label="Remove item"
          >
            <Image src="/icons/trash.svg" alt="Remove item" width={20} height={20} className="size-4 text-[#85858C]" />
          </button>
        </div>

        {/* Quantity Selector - Bottom Right */}
        <div className="flex items-center border border-[#E5E5EA] rounded-sm">
          <button
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
            className="p-2 md:p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <Input
            value={item.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              onQuantityChange(item.id, value - item.quantity);
            }}
            min={1}
            className="w-12 md:w-16 text-center py-2 md:py-3 focus:outline-none rounded-none border-none focus-visible:ring-0"
          />
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="p-2 md:p-3 hover:bg-gray-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
