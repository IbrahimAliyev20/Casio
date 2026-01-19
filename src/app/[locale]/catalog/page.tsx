"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/shared/container";
import ProductCard from "@/components/shared/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar } from "@/components/shared/FilterSection";
import { getAttributesQuery } from "@/services/attributes/queries";
import { getCategoriesQuery } from "@/services/category/queries";
import { getCatalogsQuery } from "@/services/catalogs/queries";
import { getFilteredProductsQuery } from "@/services/filter/queries";
import { FilterProductsPayload, Product } from "@/types";
import { ProductCardData } from "@/utils/productcarddata";

type SortOption = "newest" | "mostSold" | "priceLowToHigh" | "priceHighToLow" | "existsStock";
type ViewMode = "grid-3" | "grid-4" | "list";

// Convert API Product to ProductCardData format
const convertProductToCardData = (product: Product, locale: string): ProductCardData => {
  // Safely parse price - handle null, undefined, empty string
  const rawPrice = product.price;
  const price = rawPrice !== null && rawPrice !== undefined && rawPrice !== ""
    ? (typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice)
    : 0;

  // Safely parse discount_price - handle null, undefined, empty string
  const rawDiscountPrice = product.discount_price;
  const discountPrice = rawDiscountPrice !== null && rawDiscountPrice !== undefined && rawDiscountPrice !== ""
    ? (typeof rawDiscountPrice === "string" ? parseFloat(rawDiscountPrice) : rawDiscountPrice)
    : null;

  // Ensure price is always a valid number
  const finalPrice = (discountPrice && discountPrice > 0 && !isNaN(discountPrice))
    ? discountPrice
    : (price && !isNaN(price) ? price : 0);

  const finalOriginalPrice = (discountPrice && discountPrice > 0 && !isNaN(discountPrice) && price && !isNaN(price))
    ? price
    : undefined;

  return {
    id: product.id,
    image: product.image || product.thumb_image || "/images/saat.png",
    thumb_image: product.thumb_image,
    title: product.name,
    name: product.name,
    price: finalPrice,
    originalPrice: finalOriginalPrice,
    discount_price: product.discount_price,
    href: `/${locale}/${product.slug}`,
    slug: product.slug,
    category: product.category,
    stock: product.stock,
    outOfStock: product.stock === 0,
    attributes: product.attributes,
    collection_products: product.collection_products,
  };
};

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const locale = useLocale();

  // Fetch filter options
  const { data: attributesData } = useQuery(getAttributesQuery(locale));
  const { data: categoriesData } = useQuery(getCategoriesQuery(locale));
  const { data: catalogsData } = useQuery(getCatalogsQuery(locale));

  const attributes = useMemo(() => attributesData?.data || [], [attributesData]);
  const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);
  const catalogs = useMemo(() => catalogsData?.data || [], [catalogsData]);

  // Filter state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5600);
  const [selectedAttributeValueIds, setSelectedAttributeValueIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");
  const [displayedCount, setDisplayedCount] = useState(9);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Map sort option to API format
  const getSortParams = useCallback((sort: SortOption): { order_by?: FilterProductsPayload["order_by"]; order_direction?: "asc" | "desc"; exists_in_stock?: number } => {
    switch (sort) {
      case "priceLowToHigh":
        return { order_by: "price", order_direction: "asc" };
      case "priceHighToLow":
        return { order_by: "price", order_direction: "desc" };
      case "newest":
        return { order_by: "created_at", order_direction: "desc" };
      case "mostSold":
        return { order_by: "popular", order_direction: "desc" };
      case "existsStock":
        return { exists_in_stock: 1 };
      default:
        return { order_by: "price", order_direction: "desc" };
    }
  }, []);

  // Build filter payload
  const filterPayload: FilterProductsPayload = useMemo(() => {
    const sortParams = getSortParams(sortBy);
    
    // Debug: Log sortBy and sortParams
    console.log('sortBy:', sortBy);
    console.log('sortParams:', sortParams);
    
    const payload: FilterProductsPayload = {
      ...sortParams,
    };

    // Only include filters if they have values
    if (selectedCategoryIds.length > 0) {
      payload.category_ids = selectedCategoryIds;
    }
    if (selectedCatalogIds.length > 0) {
      payload.catalog_ids = selectedCatalogIds;
    }
    if (selectedAttributeValueIds.length > 0) {
      payload.attribute_value_ids = selectedAttributeValueIds;
    }
    if (minPrice > 0) {
      payload.min_price = minPrice;
    }
    // Include max_price if it's set and different from default max (5600)
    // This allows users to set a lower max price, but also allows higher values
    if (maxPrice > 0 && maxPrice !== 5600) {
      payload.max_price = maxPrice;
    }

    // Debug: Log final payload
    console.log('filterPayload before API call:', payload);

    return payload;
  }, [selectedCategoryIds, selectedCatalogIds, selectedAttributeValueIds, minPrice, maxPrice, sortBy, getSortParams]);

  // Fetch filtered products
  const { data: productsResponse, isLoading, isError } = useQuery(getFilteredProductsQuery(filterPayload));
  const apiProducts: Product[] = useMemo(() => productsResponse?.data || [], [productsResponse]);
  
  // Convert API products to ProductCardData format
  const products: ProductCardData[] = useMemo(() => 
    apiProducts.map(product => convertProductToCardData(product, locale)),
    [apiProducts, locale]
  );

  // Prevent body scroll when filter is open on mobile
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  const displayedProducts = products.slice(0, displayedCount);
  const hasMore = displayedCount < products.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + 9, products.length));
  };

  const handleAttributeValueChange = useCallback((valueId: string, checked: boolean) => {
    setSelectedAttributeValueIds((prev) => 
      checked 
        ? [...prev, valueId]
        : prev.filter(id => id !== valueId)
    );
    // Reset displayed count when filters change
    setDisplayedCount(9);
  }, []);

  const handleCategoryIdsChange = useCallback((ids: string[]) => {
    setSelectedCategoryIds(ids);
    setDisplayedCount(9);
  }, []);

  const handleCatalogIdsChange = useCallback((ids: string[]) => {
    setSelectedCatalogIds(ids);
    setDisplayedCount(9);
  }, []);

  const handleMinPriceChange = useCallback((value: number) => {
    setMinPrice(value);
    setDisplayedCount(9);
  }, []);

  const handleMaxPriceChange = useCallback((value: number) => {
    setMaxPrice(value);
    setDisplayedCount(9);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          <div className="hidden lg:block">
            <FilterSidebar 
              attributes={attributes}
              categories={categories}
              catalogs={catalogs}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
              selectedAttributeValueIds={selectedAttributeValueIds}
              onAttributeValueChange={handleAttributeValueChange}
              selectedCategoryIds={selectedCategoryIds}
              selectedCatalogIds={selectedCatalogIds}
              onCategoryIdsChange={handleCategoryIdsChange}
              onCatalogIdsChange={handleCatalogIdsChange}
            />
          </div>

          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Mobile Filter Drawer */}
          <div 
            className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
              isFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-[#F1F2F6] z-10">
              <h2 className="text-lg font-semibold">{t("filtersTitle")}</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar 
                attributes={attributes}
                categories={categories}
                catalogs={catalogs}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={handleMinPriceChange}
                onMaxPriceChange={handleMaxPriceChange}
                selectedAttributeValueIds={selectedAttributeValueIds}
                onAttributeValueChange={handleAttributeValueChange}
                selectedCategoryIds={selectedCategoryIds}
                selectedCatalogIds={selectedCatalogIds}
                onCategoryIdsChange={handleCategoryIdsChange}
                onCatalogIdsChange={handleCatalogIdsChange}
                className="border-0 shadow-none p-0" 
              />
            </div>
          </div>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#14171A]">
                  {t("title")}
                </h1>
                <p className="text-xs sm:text-sm text-[#85858C] mt-1">
                  {isLoading ? "..." : `${products.length} ${t("productsFound")}`}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 h-9 text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{t("filtersTitle")}</span>
                </Button>

                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid-4")}
                    className={`p-2 rounded ${
                      viewMode === "grid-4"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid-3")}
                    className={`p-2 rounded ${
                      viewMode === "grid-3"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <Select
                  value={sortBy}
                  onValueChange={(v) => {
                    setSortBy(v as SortOption);
                    setDisplayedCount(9);
                  }}
                >
                  <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {t("sortOptions.newest")}
                    </SelectItem>
                    <SelectItem value="mostSold">
                      {t("sortOptions.mostSold")}
                    </SelectItem>
                    <SelectItem value="priceLowToHigh">
                      {t("sortOptions.priceLowToHigh")}
                    </SelectItem>
                    <SelectItem value="priceHighToLow">
                      {t("sortOptions.priceHighToLow")}
                    </SelectItem>
                    <SelectItem value="existsStock">
                      {t("sortOptions.exists")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-[#85858C]">{t("loading") || "Yüklənir..."}</p>
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center py-12">
                <p className="text-red-500">{t("error") || "Xəta baş verdi"}</p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <div
                  className={`${
                    viewMode === "list"
                      ? "flex flex-col gap-4"
                      : `grid gap-3 sm:gap-4 md:gap-6 ${
                          viewMode === "grid-4"
                            ? "grid-cols-2 lg:grid-cols-4"
                            : "grid-cols-2 lg:grid-cols-3"
                        }`
                  }`}
                >
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-[#85858C]">{t("noProducts") || "Məhsul tapılmadı"}</p>
                    </div>
                  )}
                </div>

                {hasMore && (
                  <div className="text-center mt-8 md:mt-12">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="px-6 py-4 md:px-8 md:py-6"
                    >
                      {t("loadMore")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
