"use client";

import React, { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardData } from "../../utils/productcarddata";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getRelatedProductsQuery } from "@/services/product/queries";

interface SimiliarProductProps {
  slug: string;
}

export default function SimiliarProduct({ slug }: SimiliarProductProps) {
  const t = useTranslations("product.similiarProducts");
  const locale = useLocale();
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const { data: relatedProductsData, isLoading } = useQuery({
    ...getRelatedProductsQuery(slug, locale),
    enabled: !!slug,
  });

  const relatedProducts: ProductCardData[] = useMemo(() => {
    if (!relatedProductsData?.data) return [];

    return relatedProductsData.data.map((product) => {
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
  }, [relatedProductsData]);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = (carouselApi: CarouselApi | undefined) => {
      if (!carouselApi) return;
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Don't render if no products or loading
  if (isLoading) {
    return (
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-white">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
              {t("title")}
            </h2>
          </div>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-white">
      <>
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
              {t("title")}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                className={cn(
                  "bg-white border border-[#E5E5EA] rounded-full",
                  "size-8 sm:size-10 hover:bg-gray-50 transition-colors",
                  "flex items-center justify-center p-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                variant="ghost"
                aria-label="Previous slide"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="size-4 sm:size-5 text-black" />
              </Button>
              <Button
                className={cn(
                  "bg-white border border-[#E5E5EA] rounded-full",
                  "size-8 sm:size-10 hover:bg-gray-50 transition-colors",
                  "flex items-center justify-center p-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                variant="ghost"
                aria-label="Next slide"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                <ChevronRight className="size-4 sm:size-5 text-black" />
              </Button>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
              {relatedProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 sm:pl-3 md:pl-4 basis-[48%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </>
    </section>
  );
}
