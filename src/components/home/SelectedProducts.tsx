"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/shared/container";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardData } from "@/utils/productcarddata";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getSpecialProductsQuery } from "@/services/product/queries";
import { useLocale } from "next-intl";

export default function SelectedProducts() {
  const t = useTranslations("home.selectedProducts");
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data: specialProductsData } = useQuery(getSpecialProductsQuery(locale));

  const selectedProducts: ProductCardData[] = useMemo(() => {
    if (!specialProductsData?.data) return [];

    return specialProductsData.data.map((product,) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const discountPrice = product.discount_price ? (typeof product.discount_price === 'string' ? parseFloat(product.discount_price) : product.discount_price) : null;
      const hasDiscount = discountPrice && discountPrice < price;

      return {
        id: product.id,
        image: product.image,
        title: product.name,
        price: discountPrice || price,
        originalPrice: hasDiscount ? price : undefined,
        href: `/${product.slug}`,
        category: product.category,
        outOfStock: product.stock <= 0,
        isSelected: true,
        isDiscounted: hasDiscount || undefined,
      };
    });
  }, [specialProductsData]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on("select", () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-white">
      <Container>
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
              {t("title")}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={cn(
                  "bg-white border border-[#E5E5EA] rounded-full",
                  "size-8 sm:size-10 hover:bg-gray-50 transition-colors",
                  "flex items-center justify-center p-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                variant="ghost"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4 sm:size-5 text-black" />
              </Button>
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={cn(
                  "bg-white border border-[#E5E5EA] rounded-full",
                  "size-8 sm:size-10 hover:bg-gray-50 transition-colors",
                  "flex items-center justify-center p-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                variant="ghost"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4 sm:size-5 text-black" />
              </Button>
            </div>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
              {selectedProducts.map((product) => (
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
      </Container>
    </section>
  );
}
