"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Container from "@/components/shared/container";
import ProductCard from "@/components/shared/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { Product } from "@/types";

type SortOption = "newest" | "priceLowToHigh" | "priceHighToLow" | "onSale";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const locale = useLocale();

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: wishlistData, isLoading } = useQuery(getWishlistQuery(locale));

  const favorites = useMemo(() => {
    if (!wishlistData?.data) return [];

    let filtered = [...wishlistData.data];

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    let transformed = filtered.map((product: Product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const discountPrice = product.discount_price ? (typeof product.discount_price === 'string' ? parseFloat(product.discount_price) : product.discount_price) : null;
      const hasDiscount = discountPrice && discountPrice < price;

      return {
        id: product.id,
        image: product.image,
        title: product.name,
        price: discountPrice || price,
        originalPrice: hasDiscount ? price : undefined,
        href: `/product/${product.slug}`,
        category: product.category,
        outOfStock: product.stock <= 0,
      };
    });

    switch (sortBy) {
      case "priceLowToHigh":
        transformed = [...transformed].sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        transformed = [...transformed].sort((a, b) => b.price - a.price);
        break;
      case "onSale":
        transformed = transformed.filter(
          (product) => product.originalPrice && product.originalPrice > product.price
        );
        break;
      case "newest":
      default:
        break;
    }

    return transformed;
  }, [wishlistData, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-4 sm:py-6 md:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#14171A] mb-4 sm:mb-6 md:mb-8">
          {t("title")}
        </h1>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[180px] md:w-[220px] h-9 text-sm border border-[#E5E5EA] bg-white">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sortOptions.newest")}</SelectItem>
              <SelectItem value="priceLowToHigh">
                {t("sortOptions.priceLowToHigh")}
              </SelectItem>
              <SelectItem value="priceHighToLow">
                {t("sortOptions.priceHighToLow")}
              </SelectItem>
              <SelectItem value="onSale">{t("sortOptions.onSale")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Checkbox
              id="inStock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked === true)}
              className="border-[#E5E5EA] data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label
              htmlFor="inStock"
              className="text-xs sm:text-sm font-medium text-[#14171A] cursor-pointer"
            >
              {t("inStock")}
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 sm:py-16 md:py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} viewMode="grid-3" isFavorited={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-[#85858C] text-base sm:text-lg text-center px-4">
              {t("emptyState")}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
