"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Container from "@/components/shared/container";
import { ProductCardData } from "@/utils/productcarddata";
import SimiliarProduct from "./SimiliarProduct";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductDetailsQuery } from "@/services/product/queries";
import { AttributeValue } from "@/types";
import { useAddToBasketMutation } from "@/services/basket/mutations";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/services/wishlist/mutations";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { getContactQuery } from "@/services/contact/queries";
import Cookies from "js-cookie";

interface ProductSingleProps {
  product?: ProductCardData;
}

export default function ProductSingle({ product }: ProductSingleProps) {
  const t = useTranslations("home.product");
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const { data: contact } = useQuery(getContactQuery(locale));

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const { data: productDetails, isLoading } = useQuery(getProductDetailsQuery(slug, locale));
  const addToBasketMutation = useAddToBasketMutation({
    locale,
    onSuccess: () => {
      // Dispatch event to update basket count in header
      window.dispatchEvent(new Event("basketUpdated"));
    },
  });
  
  const addToWishlistMutation = useAddToWishlistMutation();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();
  
  // Check if product is in wishlist
  const { data: wishlistData } = useQuery(getWishlistQuery(locale));

  const productData: ProductCardData | null = useMemo(() => {
    if (product) return product; 
    if (!productDetails?.data) return null;

    const apiProduct = productDetails.data;
    const price = typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price;
    const discountPrice = apiProduct.discount_price ? (typeof apiProduct.discount_price === 'string' ? parseFloat(apiProduct.discount_price) : apiProduct.discount_price) : null;
    const hasDiscount = discountPrice && discountPrice < price;

    return {
      id: apiProduct.id,
      image: apiProduct.image,
      title: apiProduct.name,
      price: discountPrice || price,
      originalPrice: hasDiscount ? price : undefined,
      href: `/${apiProduct.slug}`,
      category: apiProduct.category,
      outOfStock: apiProduct.stock <= 0,
      isSelected: false,
      isDiscounted: hasDiscount || undefined,
      gender: apiProduct.category,
    };
  }, [product, productDetails]);

  const CollectionProducts = useMemo(() => {
    if (!productDetails?.data?.collection_products) return [];
    return productDetails.data.collection_products.slice(0, 5); // Limit to 5
  }, [productDetails]);

  // Check if product is favorited from API
  useEffect(() => {
    if (wishlistData?.data && productData?.id) {
      const isInWishlist = wishlistData.data.some((product) => product.id === productData.id);
      setIsFavorite(isInWishlist);
    }
  }, [wishlistData, productData?.id]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productData?.id) return;

    // Check if user is authenticated
    const token = Cookies.get("access_token");
    if (!token) {
      // Dispatch event to open login modal in header
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }

    const newFavoritedState = !isFavorite;
    setIsFavorite(newFavoritedState);

    try {
      if (newFavoritedState) {
        await addToWishlistMutation.mutateAsync(productData.id);
        // Dispatch event to update favorites count in header
        window.dispatchEvent(new Event("favoritesUpdated"));
      } else {
        await removeFromWishlistMutation.mutateAsync(productData.id);
        // Dispatch event to update favorites count in header
        window.dispatchEvent(new Event("favoritesUpdated"));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorite(!newFavoritedState); // Rollback on error
    }
  };

  // Loading state
  if (isLoading || !productData) {
    return (
      <Container className="py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Məhsul yüklənir...</p>
          </div>
        </div>
      </Container>
    );
  }

  const productImages = [
    productData.image,
    productData.image,
    productData.image,
    productData.image,
  ];

  const stockCount = productDetails?.data?.stock || 12;
  const hasDiscount =
    productData.originalPrice && productData.originalPrice > productData.price;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(stockCount, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!productDetails?.data?.id) {
      console.error("Product ID not available");
      return;
    }
    
    // Check if user is authenticated
    const token = Cookies.get("access_token");
    if (!token) {
      // Dispatch event to open login modal in header
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }
    
    addToBasketMutation.mutate(
      { productId: productDetails.data.id, quantity },
      {
        onSuccess: () => {
          // Optionally show success message or notification
          console.log("Product added to basket successfully");
        },
        onError: (error) => {
          console.error("Failed to add product to basket:", error);
          // Optionally show error message to user
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!productDetails?.data?.id) {
      console.error("Product ID not available");
      return;
    }
    
    // Check if user is authenticated
    const token = Cookies.get("access_token");
    if (!token) {
      // Dispatch event to open login modal in header
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }
    
    addToBasketMutation.mutate(
      { productId: productDetails.data.id, quantity },
      {
        onSuccess: () => {
          // Navigate to basket page after adding to cart
          router.push(`/${locale}/basket`);
        },
        onError: (error) => {
          console.error("Failed to add product to basket:", error);
          // Optionally show error message to user
        },
      }
    );
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Salam, ${productData.title} məhsulu haqqında məlumat istəyirəm.`
    );
    window.open(`https://wa.me/${contact?.data?.whatsapp_contact}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.title,
          text: `Casio ${productData.title} məhsuluna baxın`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Container className="py-4 sm:py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="relative w-full aspect-square bg-[#FAFDFF] rounded-sm overflow-hidden">
            <Image
              src={productImages[selectedImageIndex] || productData.image}
              alt={productData.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 z-10">
              <button
                onClick={toggleFavorite}
                className={`p-1 sm:p-2 transition-all bg-white rounded-full shadow-sm hover:shadow-md ${
                  isFavorite ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={`size-8 sm:size-10 transition-colors ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-black"
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-1 sm:p-2 transition-all"
                aria-label="Share product"
              >
                <Image
                  src="/icons/share.svg"
                  alt="Share"
                  width={20}
                  height={20}
                  className="size-8 sm:size-10 text-black"
                />
              </button>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#FAFDFF] rounded-sm overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-black"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productData.title} - View ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            {productData.title}
          </h1>

          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="text-xs sm:text-sm text-black">
              {t("similarColors")}
            </p>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              {CollectionProducts.map((collectionProduct) => (
                <button
                  key={collectionProduct.slug}
                  onClick={() => router.push(`/${collectionProduct.slug}`)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0  overflow-hidden border-2 transition-all`}
                >
                  <Image src={collectionProduct.image} alt={collectionProduct.slug} fill className="object-cover object-center" sizes="64px" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
            <div className="flex items-baseline gap-2 sm:gap-3">
              {hasDiscount && (
                <span className="text-base sm:text-lg text-[#85858C] line-through">
                  {productData.originalPrice!.toFixed(2)} ₼
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {productData.price.toFixed(2)} ₼
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#003297] whitespace-nowrap">
              {t("stockCount")}: {stockCount}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center gap-0 border border-black rounded-none w-full sm:w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 sm:px-2 py-3 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <Input
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(stockCount, value)));
                  }}
                  min={1}
                  max={stockCount}
                  className="w-12 sm:w-10 text-center rounded-none border-none focus-visible:ring-0"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stockCount}
                  className="px-3 sm:px-2 py-3 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={productData.outOfStock || addToBasketMutation.isPending}
                className="flex-1 bg-black text-white hover:bg-black/90 h-11 sm:h-12 text-sm sm:text-base font-medium rounded-none gap-2"
              >
                <Image
                  src="/icons/shopping-bag.svg"
                  alt="Shopping bag"
                  width={20}
                  height={20}
                  className="brightness-0 invert w-4 h-4 sm:w-5 sm:h-5"
                />
                {addToBasketMutation.isPending ? "Yüklənir..." : t("addToCart")}
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={productData.outOfStock}
              variant="outline"
              className="w-full border border-black bg-white text-black hover:bg-gray-50 h-11 sm:h-12 text-sm sm:text-base font-medium rounded-none"
            >
              {t("buyNow")}
            </Button>

            <Button
              onClick={handleWhatsAppContact}
              variant="outline"
              className="w-full border border-black bg-white text-black hover:bg-gray-50 h-11 sm:h-12 text-sm sm:text-base font-medium rounded-none gap-2"
            >
              <Image
                src="/icons/whatsappdetail.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              {t("contactWhatsApp")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-[9px] text-xs sm:text-sm">
        <h1 className="py-8 text-base sm:text-lg md:text-[32px]  font-medium text-black">
          Detallı məlumat
        </h1>
        <div className="w-1/2">
          {productDetails?.data?.attributes?.map((attribute: AttributeValue) => (
            <div className="flex items-center justify-between" key={attribute.attribute}>
              <span className="text-[#707072]">{attribute.attribute}:</span>
              <span className="font-medium text-black">{attribute.attribute_value}</span>
            </div>
          ))}
        </div>
      </div>
      <SimiliarProduct slug={slug} /> 
    </Container>
  );
}
