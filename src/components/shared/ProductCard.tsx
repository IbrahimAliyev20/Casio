"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Minus } from "lucide-react";
import { ProductCardData } from "@/utils/productcarddata";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/services/wishlist/mutations";
import { useAddToBasketMutation } from "@/services/basket/mutations";
import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "@/services/wishlist/queries";
import Cookies from "js-cookie";

interface ProductCardProps {
  product: ProductCardData;
  viewMode?: "grid-3" | "grid-4" | "list";
  isFavorited?: boolean;
}
export default function ProductCard({
  product,
  viewMode = "grid-3",
  isFavorited: initialIsFavorited = false,
}: ProductCardProps) {
  const {
    id,
    image,
    title,
    price,
    originalPrice,
    href = "#",
    outOfStock = false,
    gender,
    mechanism,
    strap,
    glass,
    ledLight,
  } = product;
  
  // Ensure price is always a valid number
  const safePrice = (price !== null && price !== undefined && !isNaN(Number(price))) ? Number(price) : 0;
  const safeOriginalPrice = (originalPrice !== null && originalPrice !== undefined && !isNaN(Number(originalPrice))) ? Number(originalPrice) : undefined;
  
  const hasDiscount = safeOriginalPrice && safeOriginalPrice > safePrice;
  const discountPercentage = hasDiscount && safeOriginalPrice
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
    : 0;
  const tProduct = useTranslations("home.product");
  const tf = useTranslations("catalog.filters");
  const locale = useLocale();
  const outOfStockText = tProduct("outOfStock");
  const addToCartText = tProduct("addToCart");
  const stockCountText = tProduct("stockCount");
  const viewDetailsText = tProduct("viewDetails");
  
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const stockCount = 12;

  const addToWishlistMutation = useAddToWishlistMutation();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();
  const addToBasketMutation = useAddToBasketMutation({
    locale,
    onSuccess: () => {
      // Dispatch event to update basket count in header
      window.dispatchEvent(new Event("basketUpdated"));
    },
  });
  
  // Check if product is in wishlist
  const { data: wishlistData } = useQuery(getWishlistQuery(locale));
  
  useEffect(() => {
    if (isQuickViewOpen) {
      setQuantity(1);
    }
  }, [isQuickViewOpen]);

  // Check if product is favorited from API or prop
  useEffect(() => {
    // If explicitly set as favorited (e.g., from favorites page), use that
    if (initialIsFavorited) {
      setIsFavorited(true);
      return;
    }
    
    // Otherwise, check wishlist API
    if (wishlistData?.data) {
      const isInWishlist = wishlistData.data.some((product) => product.id === id);
      setIsFavorited(isInWishlist);
    }
  }, [initialIsFavorited, wishlistData, id]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    const token = Cookies.get("access_token");
    if (!token) {
      // Dispatch event to open login modal in header
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }

    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    try {
      if (newFavoritedState) {
        await addToWishlistMutation.mutateAsync(id);
      } else {
        await removeFromWishlistMutation.mutateAsync(id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorited(!newFavoritedState);
    }
  };
  
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(stockCount, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (outOfStock) return;
    
    // Check if user is authenticated
    const token = Cookies.get("access_token");
    if (!token) {
      // Dispatch event to open login modal in header
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }
    
    addToBasketMutation.mutate({
      productId: id,
      quantity: quantity,
    });
  };

  if (viewMode === "list") {
    return (
      <div className="group relative bg-white border-b border-[#E5E5EA] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
          <div className="relative w-full sm:w-[200px] md:w-[280px] lg:w-[320px] h-[200px] sm:h-auto sm:self-stretch shrink-0 overflow-hidden bg-[#FAFDFF]">
            <Link
              href={href}
              className="absolute inset-0 z-0"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </Link>

            {outOfStock && (
              <div className="absolute right-2 bottom-2 flex items-center justify-center z-20">
                <div className="bg-black text-white px-3 py-1 sm:px-[18px] sm:py-[6px] text-sm sm:text-base font-medium">
                  {outOfStockText}
                </div>
              </div>
            )}

            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-[#a92c2b] text-white px-3 py-1 sm:px-[18px] sm:py-[6px] text-sm sm:text-base font-medium z-10">
                -{discountPercentage}%
              </div>
            )}

            <button
              onClick={toggleFavorite}
              className={`absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all z-20 ${isFavorited ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'}`}
              aria-label="Add to wishlist"
            >
              <Heart 
                className={`size-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 flex flex-col gap-2 sm:gap-4 pr-0 sm:pr-8">
              <Link href={href} className="flex flex-col gap-1">
                <p className="text-xs sm:text-sm text-[#85858C] uppercase tracking-wide">
                  CASIO
                </p>
                <h3 className="font-semibold text-base sm:text-lg leading-5 sm:leading-6 text-black">
                  {title}
                </h3>
              </Link>

              {(gender || mechanism || strap || glass || ledLight) && (
                <div className="hidden sm:flex flex-col gap-2 text-sm mt-1">
                  {gender && (
                    <div className="flex justify-between items-center gap-4 md:gap-8">
                      <span className="text-[#85858C] text-left">
                        {tf("gender")}:
                      </span>
                      <span className="text-black font-medium text-right">
                        {gender}
                      </span>
                    </div>
                  )}
                  {mechanism && (
                    <div className="flex justify-between items-center gap-4 md:gap-8">
                      <span className="text-[#85858C] text-left">
                        {tf("mechanism")}:
                      </span>
                      <span className="text-black font-medium text-right">
                        {mechanism}
                      </span>
                    </div>
                  )}
                  {strap && (
                    <div className="flex justify-between items-center gap-4 md:gap-8">
                      <span className="text-[#85858C] text-left">
                        {tf("strap")}:
                      </span>
                      <span className="text-black font-medium text-right">
                        {strap}
                      </span>
                    </div>
                  )}
                  {glass && (
                    <div className="flex justify-between items-center gap-4 md:gap-8">
                      <span className="text-[#85858C] text-left">
                        {tf("glass")}:
                      </span>
                      <span className="text-black font-medium text-right">
                        {glass}
                      </span>
                    </div>
                  )}
                  {ledLight && (
                    <div className="flex justify-between items-center gap-4 md:gap-8">
                      <span className="text-[#85858C] text-left">
                        Led işıq:
                      </span>
                      <span className="text-black font-medium text-right">
                        {ledLight}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mt-3 sm:mt-auto pt-2">
              <div className="flex items-baseline gap-2 flex-1">
                {hasDiscount && (
                  <span className="font-normal text-sm sm:text-base leading-5 text-[#85858C] line-through">
                    {safeOriginalPrice?.toFixed(2)} ₼
                  </span>
                )}
                <span className="font-semibold text-lg sm:text-xl leading-6 text-black">
                  {safePrice.toFixed(2)} ₼
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock || addToBasketMutation.isPending}
                className={`font-medium text-xs leading-4 py-3 px-4 sm:py-[12px] sm:px-[24px] flex items-center justify-center gap-2 transition-colors w-full sm:w-auto sm:min-w-[180px] ${
                  outOfStock || addToBasketMutation.isPending
                    ? "bg-[#8e8e93] text-[#e5e5ea] cursor-not-allowed"
                    : "bg-black text-white hover:bg-black/90"
                }`}
                aria-label="Add to cart"
              >
                <Image
                  src="/icons/shopping-bag.svg"
                  alt="Add to Cart"
                  width={20}
                  height={20}
                  className="brightness-0 invert w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>{addToBasketMutation.isPending ? "Yüklənir..." : addToCartText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-[#E5E5EA] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="flex flex-col flex-1">
        <div className="relative w-full aspect-square overflow-hidden ">
          <Link href={href} className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {outOfStock && (
            <div className="absolute right-2 sm:right-6 bottom-0 flex items-center justify-center z-20">
              <div className="bg-black text-white px-2 py-1 sm:px-[18px] sm:py-[6px] text-xs sm:text-base font-medium">
                {outOfStockText}
              </div>
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 sm:top-7 bg-[#a92c2b] text-white px-2 py-1 sm:px-[18px] sm:py-[6px] text-xs sm:text-base font-medium z-10">
              -{discountPercentage}%
            </div>
          )}

          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 bg-white rounded-full p-1.5 sm:p-2 shadow-sm hover:shadow-md transition-all z-20 ${isFavorited ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'}`}
            aria-label="Add to wishlist"
          >
            <Heart 
              className={`size-3 sm:size-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute top-12 right-2 bg-white rounded-full p-1.5 sm:p-2 shadow-sm hover:shadow-md transition-all z-20 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Quick view"
          >
            <Image
              src="/icons/lupa.svg"
              alt="Quick view"
              width={20}
              height={20}
              className="size-4 transition-colors"
            />
          </button>
        </div>

        <Link href={href} className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 p-2 sm:p-4 space-y-1.5 sm:space-y-3">
            <p className="text-xs sm:text-sm text-[#85858C] uppercase">CASIO</p>
            <h3 className="font-medium text-sm sm:text-base leading-5 sm:leading-6 text-black line-clamp-2 flex-1">
              {title}
            </h3>

            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              {hasDiscount && (
                <span className="font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-[#85858C] line-through">
                  {safeOriginalPrice?.toFixed(2)} ₼
                </span>
              )}
              <span className="font-semibold text-sm sm:text-lg leading-5 sm:leading-6 text-black">
                {safePrice.toFixed(2)} ₼
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock || addToBasketMutation.isPending}
              className={`w-full font-medium text-[10px] sm:text-xs leading-4 py-2 sm:py-[12px] px-2 sm:px-[24px] flex items-center justify-center gap-1 sm:gap-2 transition-colors mt-auto ${
                outOfStock || addToBasketMutation.isPending
                  ? "bg-[#8e8e93] text-[#e5e5ea] cursor-not-allowed"
                  : "bg-black text-white hover:bg-black/90"
              }`}
              aria-label="Add to cart"
            >
              <Image
                src="/icons/shopping-bag.svg"
                alt="Add to Cart"
                width={20}
                height={20}
                className="brightness-0 invert w-3.5 h-3.5 sm:w-5 sm:h-5"
              />
              <span className="truncate">{addToBasketMutation.isPending ? "Yüklənir..." : addToCartText}</span>
            </button>
          </div>
        </Link>
      </div>
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="min-w-4xl w-full h-[400px] p-0 gap-0 bg-white rounded-[2px] overflow-hidden">
          <div className="flex flex-col  md:flex-row">
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-auto bg-[#FAFDFF] ">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8 justify-between  ">
              <h2 className="text-xl md:text-2xl font-medium  text-black mb-2">
                {title}
              </h2>
              
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="font-normal text-base text-[#85858C] line-through">
                      {safeOriginalPrice?.toFixed(2)} ₼
                    </span>
                  )}
                  <span className="font-semibold text-xl md:text-[32px] text-black">
                    {safePrice.toFixed(2)} ₼
                  </span>
                </div>
                <span className="text-sm text-[#85858C]">
                  {stockCountText}: {stockCount}
                </span>
              </div>
              
      
              
              <div >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-[#E5E5EA] rounded-[2px]">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 md:p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      const newQuantity = Math.max(1, Math.min(stockCount, value));
                      setQuantity(newQuantity);
                    }}
                    min={1}
                    max={stockCount}
                    className="w-12 md:w-16 text-center py-2 md:py-3 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stockCount}
                    className="p-2 md:p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock || addToBasketMutation.isPending}
                  className={`flex-1 font-medium text-sm md:text-base py-2 md:py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-colors ${
                    outOfStock || addToBasketMutation.isPending
                      ? "bg-[#8e8e93] text-[#e5e5ea] cursor-not-allowed"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                  aria-label="Add to cart"
                >
                  <Image
                    src="/icons/shopping-bag.svg"
                    alt="Add to Cart"
                    width={20}
                    height={20}
                    className="brightness-0 invert w-5 h-5"
                  />
                  <span>{addToBasketMutation.isPending ? "Yüklənir..." : addToCartText}</span>
                </button>
              </div>
                <Link
                  href={href}
                  onClick={() => setIsQuickViewOpen(false)}
                  className="w-full font-medium text-sm md:text-base py-3 md:py-4 px-4 md:px-6 flex items-center justify-center gap-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  {viewDetailsText}
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
