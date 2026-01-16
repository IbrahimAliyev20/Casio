"use client";

import Container from "@/components/shared/container";
import { useState, useMemo, useEffect, useCallback } from "react";
import { BasketItem } from "@/components/basket/types";
import BasketHeader from "@/components/basket/BasketHeader";
import BasketItemComponent from "@/components/basket/BasketItem";
import OrderSummary from "@/components/basket/OrderSummary";
import EmptyCart from "@/components/basket/EmptyCart";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardData } from "@/utils/productcarddata";
import { useTranslations, useLocale } from "next-intl";
import FavoritProduct from "../shared/FavoritProduct";
import { useBasketQuery } from "@/services/basket/queries";
import {
  useAddToBasketMutation,
  useRemoveFromBasketMutation,
} from "@/services/basket/mutations";
import { transformBasketItems } from "@/services/basket/utils";
import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { useCheckPromocodeMutation } from "@/services/promocode/mutations";

export default function Basket() {
  const t = useTranslations("basket");
  const locale = useLocale();

  const {
    data: basketData,
    isLoading,
    error,
  } = useBasketQuery({ locale });

  const { data: wishlistResponse } = useQuery(getWishlistQuery(locale));

  const favoriteProducts: ProductCardData[] = useMemo(() => {
    if (!wishlistResponse?.data) return [];

    return wishlistResponse.data.slice(0, 4).map((product) => {
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

  const apiItems = useMemo(() => {
    if (!basketData?.data) return [];
    return transformBasketItems(basketData.data);
  }, [basketData]);

  const [items, setItems] = useState<BasketItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState<{ product_price: number; promocode_price: number; promocode_id: number } | null>(null);

  useEffect(() => {
    if (apiItems.length > 0) {
      setItems(apiItems);
    } else if (!isLoading && apiItems.length === 0) {
      setItems([]);
    }
  }, [apiItems, isLoading]);


  const addToBasketMutation = useAddToBasketMutation({
    locale,
    onSuccess: () => {
      window.dispatchEvent(new Event("basketUpdated"));
    },
  });

  const removeFromBasketMutation = useRemoveFromBasketMutation({
    locale,
    onError: () => {
      window.dispatchEvent(new Event("basketUpdated"));
    },
  });

  const checkPromocodeMutation = useCheckPromocodeMutation({
    onSuccess: (data) => {
      if (data.status && data.data) {
        setPromoData(data.data);
        setPromoApplied(true);
        // Save promo data to localStorage for confirm page
        localStorage.setItem('basketPromoData', JSON.stringify(data.data));
        localStorage.setItem('basketPromoCode', promoCode);
      }
    },
    onError: () => {
      setPromoApplied(false);
      setPromoData(null);
      // Clear promo data from localStorage
      localStorage.removeItem('basketPromoData');
      localStorage.removeItem('basketPromoCode');
    },
  });

  const selectedItems = items.filter((item) => item.selected);
  const allSelected = items.length > 0 && items.every((item) => item.selected);

  const handleSelectAll = (checked: boolean) => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, selected: checked }))
    );
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);
    const quantityDifference = newQuantity - currentItem.quantity;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    if (quantityDifference > 0) {
      addToBasketMutation.mutate({
        productId: id,
        quantity: quantityDifference,
      });
    } else if (quantityDifference < 0) {
      removeFromBasketMutation.mutate({
        productId: id,
        quantity: Math.abs(quantityDifference),
      });
    }
  };

  const handleRemoveItem = (id: number) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    removeFromBasketMutation.mutate({
      productId: id,
      quantity: currentItem.quantity,
    });
  };

  const handleRemoveSelected = () => {
    setItems((prev) => prev.filter((item) => !item.selected));

    selectedItems.forEach((item) => {
      removeFromBasketMutation.mutate({
        productId: item.id,
        quantity: item.quantity,
      });
    });
  };

  const handleCancelPromo = useCallback(() => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoData(null);
    // Clear promo data from localStorage
    localStorage.removeItem('basketPromoData');
    localStorage.removeItem('basketPromoCode');
  }, []);

  // Validate promocode when basket items change
  useEffect(() => {
    if (promoData && promoApplied && items.length > 0) {
      const selectedItemsForValidation = items
        .filter((item) => item.selected)
        .map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }));

      const currentSelectedTotal = items
        .filter((item) => item.selected)
        .reduce((sum, item) => {
          const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0)) || 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity || 0), 10) || 0;
          return sum + price * quantity;
        }, 0);

      // Check if promocode still matches current basket
      const priceDifference = Math.abs(promoData.product_price - currentSelectedTotal);
      if (priceDifference >= 0.01 || selectedItemsForValidation.length === 0) {
        // Basket changed significantly or no items selected, clear promocode
        handleCancelPromo();
      }
    } else if (promoData && promoApplied && items.length === 0) {
      // Basket is empty but promocode exists, clear it
      handleCancelPromo();
    }
  }, [items, promoData, promoApplied, handleCancelPromo]);

  const handleCheckPromocode = (code: string) => {
    setPromoCode(code);
    const selectedItemsForPromo = selectedItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));
    checkPromocodeMutation.mutate({
      promocode: code,
      items: selectedItemsForPromo
    });
  };

  const selectedItemsTotal = selectedItems.reduce(
    (sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0)) || 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity || 0), 10) || 0;
      return sum + price * quantity;
    },
    0
  );

  const discountAmount = promoApplied && promoData
    ? selectedItemsTotal - promoData.promocode_price
    : 0;

  const finalTotal = selectedItemsTotal - discountAmount;

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg">{t("loading") || "Loading..."}</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-red-500">
            {t("error") || "Error loading basket"}
          </p>
        </div>
      </Container>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container className="py-8">
        <EmptyCart />

        {favoriteProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">
              {t("likedProducts")}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid-4"
                  isFavorited={true}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <BasketHeader
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            onRemoveSelected={handleRemoveSelected}
          />

          <div className="space-y-4">
            {items.map((item) => (
              <BasketItemComponent
                key={item.id}
                item={item}
                onSelect={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        <OrderSummary
          selectedItemsCount={selectedItems.length}
          selectedItemsTotal={selectedItemsTotal}
          promoCode={promoCode}
          promoApplied={promoApplied}
          promoDiscount={promoData ? Math.round(((selectedItemsTotal - promoData.promocode_price) / selectedItemsTotal) * 100) : 0}
          discountAmount={discountAmount}
          finalTotal={finalTotal}
          onCancelPromo={handleCancelPromo}
          onCheckPromocode={handleCheckPromocode}
          isCheckingPromocode={checkPromocodeMutation.isPending}
        />
      </div>

      <FavoritProduct />
    </Container>
  );
}