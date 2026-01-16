import React from 'react'
import ProductCard from './ProductCard'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { ProductCardData } from "@/utils/productcarddata";

export default function FavoritProduct() {
    const t = useTranslations("basket");
    const locale = useLocale();
    const { data: wishlistResponse, isLoading: isWishlistLoading } = useQuery(getWishlistQuery(locale));

    const favoriteProducts: ProductCardData[] = React.useMemo(() => {
        if (!wishlistResponse?.data) return [];

        return wishlistResponse.data.slice(0, 4).map((product) => {
            // Transform Product API data to ProductCardData format
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            const discountPrice = product.discount_price ? (typeof product.discount_price === 'string' ? parseFloat(product.discount_price) : product.discount_price) : null;
            const hasDiscount = discountPrice && discountPrice < price;

            return {
                id: product.id,
                image: product.image || product.thumb_image,
                title: product.name,
                price: discountPrice || price,
                originalPrice: hasDiscount ? price : undefined,
                href: `/${product.slug}`,
                category: product.category,
                outOfStock: product.stock <= 0,
                isSelected: false,
                isDiscounted: hasDiscount || undefined,
            };
        });
    }, [wishlistResponse]);

  return (
    <div className="mt-12 sm:mt-16 md:mt-25 ">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-6 sm:mb-8">
        {t("likedProducts")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {isWishlistLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))
        ) : favoriteProducts.length > 0 ? (
          favoriteProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode="grid-4" 
              isFavorited={true}
            />
          ))
        ) : null}
      </div>
    </div>
  )
}
