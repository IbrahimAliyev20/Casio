"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBranchesQuery } from "@/services/contact/queries";
import { getUserAddressesQuery } from "@/services/user/queries";
import { useBasketQuery } from "@/services/basket/queries";
import { useCreateOrderMutation } from "@/services/orders/mutations";
import { CreateOrderPayload } from "@/types";
import { ArrowLeft, Plus } from "lucide-react";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

export default function ConfirmPage() {
  const t = useTranslations("confirm");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: branchesData } = useQuery(getBranchesQuery(locale));
  const { data: userAddressesData, isError: userAddressesError } = useQuery(
    getUserAddressesQuery(locale)
  );
  const { data: basketData } = useBasketQuery({ locale });

  const createOrderMutation = useCreateOrderMutation({
    onSuccess: () => {
      // Clear promocode data
      localStorage.removeItem("basketPromoData");
      localStorage.removeItem("basketPromoCode");

      // Clear basket data from localStorage if exists
      localStorage.removeItem("basketData");
      localStorage.removeItem("basketItems");

      // Completely clear basket queries from cache
      queryClient.removeQueries({ queryKey: ["basket-products"] });
      queryClient.removeQueries({ queryKey: ["basket"] });

      // Clear all basket related cache
      queryClient.invalidateQueries({ queryKey: ["basket"] });

      // Redirect to home page after successful order
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 100);
    },
  });

  const [fullName, setFullName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+994");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedUserAddress, setSelectedUserAddress] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedInstallmentPeriod, setSelectedInstallmentPeriod] =
    useState("3");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Promo code data from localStorage (applied in basket page)
  const [promoCode, setPromoCode] = useState("");
  const [promoData, setPromoData] = useState<{
    product_price: number;
    promocode_price: number;
    promocode_id: number;
  } | null>(null);

  // Basket products from API
  const basketProducts = useMemo(() => basketData?.data || [], [basketData]);

  // Load promo data from localStorage on component mount
  // Only load if it matches current basket items
  useEffect(() => {
    const storedPromoData = localStorage.getItem("basketPromoData");
    const storedPromoCode = localStorage.getItem("basketPromoCode");

    if (storedPromoData && storedPromoCode && basketProducts.length > 0) {
      try {
        const parsedPromoData = JSON.parse(storedPromoData);
        
        // Validate that promocode matches current basket
        // Check if the stored product_price matches current basket total
        const currentBasketTotal = basketProducts.reduce((sum, item) => {
          const productPrice =
            typeof item.product.price === "string"
              ? parseFloat(item.product.price)
              : item.product.price;
          const discountPrice = item.product.discount_price
            ? typeof item.product.discount_price === "string"
              ? parseFloat(item.product.discount_price)
              : item.product.discount_price
            : null;
          const finalPrice = discountPrice || productPrice;
          return sum + finalPrice * item.quantity;
        }, 0);

        // Only use promocode if it matches current basket (within small tolerance for rounding)
        const priceDifference = Math.abs(parsedPromoData.product_price - currentBasketTotal);
        if (priceDifference < 0.01) {
          setPromoData(parsedPromoData);
          setPromoCode(storedPromoCode);
        } else {
          // Basket changed, clear promocode
          localStorage.removeItem("basketPromoData");
          localStorage.removeItem("basketPromoCode");
          setPromoData(null);
          setPromoCode("");
        }
      } catch (error) {
        console.error("Error parsing promo data from localStorage:", error);
        localStorage.removeItem("basketPromoData");
        localStorage.removeItem("basketPromoCode");
        setPromoData(null);
        setPromoCode("");
      }
    } else if (storedPromoData && storedPromoCode && basketProducts.length === 0) {
      // Basket is empty but promocode exists, clear it
      localStorage.removeItem("basketPromoData");
      localStorage.removeItem("basketPromoCode");
      setPromoData(null);
      setPromoCode("");
    } else if (!storedPromoData || !storedPromoCode) {
      // No promocode in storage, ensure state is cleared
      setPromoData(null);
      setPromoCode("");
    }
  }, [basketProducts]);

  // Calculate prices from API data or basket data
  const productTotal = promoData
    ? promoData.product_price
    : basketProducts.reduce((sum, item) => {
        const productPrice =
          typeof item.product.price === "string"
            ? parseFloat(item.product.price)
            : item.product.price;
        const discountPrice = item.product.discount_price
          ? typeof item.product.discount_price === "string"
            ? parseFloat(item.product.discount_price)
            : item.product.discount_price
          : null;
        const finalPrice = discountPrice || productPrice;
        return sum + finalPrice * item.quantity;
      }, 0);

  const discount = promoData
    ? promoData.product_price - promoData.promocode_price
    : 0;
  const deliveryCost = 10.0;
  const finalTotal = promoData
    ? promoData.promocode_price + deliveryCost
    : productTotal + deliveryCost;

  // Branch data from API
  const branches = branchesData?.data || [];

  const selectedBranchData = selectedBranch !== null
    ? branches.find((branch) => (branch.store_id ) === selectedBranch)
    : null;

  // User addresses data from API
  const userAddresses = userAddressesData?.data || [];
  const hasUserAddresses = !userAddressesError && userAddresses.length > 0;

  const selectedUserAddressData = selectedUserAddress
    ? userAddresses.find((addr) => addr.id === selectedUserAddress)
    : null;

  // Populate form fields when user address is selected
  useEffect(() => {
    if (selectedUserAddressData) {
      setCity(selectedUserAddressData.city_or_region);
      setPostalCode(selectedUserAddressData.post_code);
      setAddress(selectedUserAddressData.address);
    }
  }, [selectedUserAddressData]);

  // Handle form submission
  const handleSubmitOrder = () => {
    if (!agreeToTerms) return;

    const orderData: CreateOrderPayload = {
      full_name: fullName,
      phone: phoneCode + phoneNumber,
      delivery_type: deliveryMethod === "courier" ? 0 : 1,
      payment_type:
        paymentMethod === "card" ? 0 : paymentMethod === "cash" ? 1 : 2,
      items: basketProducts.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    // Add address fields for courier delivery
    if (deliveryMethod === "courier") {
      if (hasUserAddresses && selectedUserAddress) {
        orderData.address_id = selectedUserAddress;
      } else {
        orderData.city = city;
        orderData.post_code = postalCode;
        orderData.address = address;
      }
    }

    // Add selected branch for pickup
    if (deliveryMethod === "pickup" && selectedBranch !== null) {
      orderData.store_id = selectedBranch;
    }

    if (paymentMethod === "installment") {
      orderData.installment_month = parseInt(selectedInstallmentPeriod);
    }

    // Add note if provided
    if (showNote && note.trim()) {
      orderData.note = note.trim();
    }

    // Add promo code if applied (from basket page)
    if (promoData) {
      orderData.promocode_id = promoData.promocode_id;
    }

    // Clear promocode immediately when order is submitted
    // Promocode should only be used once, so clear it before sending order
    localStorage.removeItem("basketPromoData");
    localStorage.removeItem("basketPromoCode");
    setPromoData(null);
    setPromoCode("");

    createOrderMutation.mutate(orderData);
  };

  return (
    <Container className="py-4 sm:py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-8">
            {t("title")}
          </h1>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-black">
                {t("contactInfo")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#85858C]">
                    {t("fullName")}
                  </label>
                  <Input
                    placeholder={t("fullNamePlaceholder")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 border-[#8E8E93] rounded-[2px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#85858C]">
                    {t("phoneNumber")}
                  </label>
                  <div className="flex gap-2 items-center border border-[#8E8E93] rounded-[2px]">
                    <Select value={phoneCode} onValueChange={setPhoneCode}>
                      <SelectTrigger className="w-[100px] h-12 border-none shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+994">+994</SelectItem>
                        <SelectItem value="+7">+7</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("phonePlaceholder")}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 h-12 border-none shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">
                {t("deliveryMethod")}
              </h2>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={setDeliveryMethod}
                className="space-y-2"
              >
                <RadioGroupItem value="courier">
                  {t("courierDelivery")}
                </RadioGroupItem>
                <RadioGroupItem value="pickup">
                  {t("pickupFromStore")}
                </RadioGroupItem>
              </RadioGroup>

              {deliveryMethod === "pickup" && (
                <div className="space-y-2">
                  <h3 className="text-base font-normal text-black">
                    {t("selectBranch")}
                  </h3>
                  <Select
                    value={selectedBranch?.toString() || ""}
                    onValueChange={(value) => setSelectedBranch(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="!h-12 py-4 !border-[#8E8E93] rounded-[2px] w-full">
                      <SelectValue placeholder={t("selectStoreBranch")} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch, index) => {
                        // store_id varsa kullan, yoksa index kullan (fallback)
                        const storeValue = branch.store_id ?? index;
                        return (
                          <SelectItem key={storeValue} value={storeValue.toString()}>
                            {branch.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Branch Details - shown when a branch is selected */}
                  {selectedBranchData && (
                    <div className="bg-[#F8F8F8] rounded-[2px] p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-[#85858C]">
                            {t("address")}
                          </p>
                          <p className="text-base font-semibold text-black">
                            {selectedBranchData.address}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-[#85858C]">
                            {t("workingHours")}
                          </p>
                          <p className="text-base font-semibold text-black">
                            {selectedBranchData.working_hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Delivery Address */}
            {deliveryMethod === "courier" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-black">
                  {t("deliveryAddressTitle")}
                </h2>

                {hasUserAddresses ? (
                  /* Address Select */
                  <div className="space-y-2">
                    <label className="text-sm text-[#000]">
                      {t("address")}
                    </label>
                    <Select
                      value={selectedUserAddress?.toString() || ""}
                      onValueChange={(value) => setSelectedUserAddress(value ? parseInt(value) : null)}
                    >
                      <SelectTrigger className="w-full mt-4 h-12 border-[#8E8E93] rounded-[2px]">
                        <SelectValue placeholder={t("selectStoreBranch")} />
                      </SelectTrigger>
                      <SelectContent>
                        {userAddresses.map((userAddress) => (
                          <SelectItem
                            key={userAddress.id}
                            value={userAddress.id.toString()}
                          >
                            {userAddress.address_title} -{" "}
                            {userAddress.city_or_region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  /* Manual Address Input */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-[#85858C]">
                          {t("city")}
                        </label>
                        <Input
                          placeholder={t("cityPlaceholder")}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-12 border-[#8E8E93] rounded-[2px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-[#85858C]">
                          {t("postalCode")}
                        </label>
                        <Input
                          placeholder={t("postalCodePlaceholder")}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="h-12 border-[#8E8E93] rounded-[2px]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#85858C]">
                        {t("address")}
                      </label>
                      <Input
                        placeholder={t("addressPlaceholder")}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-12 border-[#8E8E93] rounded-[2px]"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Payment Method */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">
                {t("paymentMethod")}
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
                <RadioGroupItem value="card">{t("cardPayment")}</RadioGroupItem>
                <RadioGroupItem value="cash">
                  {t("cashOnDelivery")}
                </RadioGroupItem>
                <RadioGroupItem value="installment">
                  {t("installmentPayment")}
                </RadioGroupItem>
              </RadioGroup>
            </div>
            {/* Installment Period Selection - shown when installment is selected */}
            {paymentMethod === "installment" && (
              <div className="space-y-4">
                <h3 className="text-base font-normal text-black">
                  {t("selectPaymentPeriod")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { period: "3", monthlyPrice: 64.9 },
                    { period: "6", monthlyPrice: 32.3 },
                    { period: "9", monthlyPrice: 24.9 },
                    { period: "12", monthlyPrice: 12.9 },
                  ].map((option) => (
                    <button
                      key={option.period}
                      onClick={() =>
                        setSelectedInstallmentPeriod(option.period)
                      }
                      className={`p-4 rounded-[2px] bg-white text-left transition-colors ${
                        selectedInstallmentPeriod === option.period
                          ? "border border-black"
                          : "border border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-black">
                          {option.period} <span className="text-base">ay</span>
                        </p>
                        <p className="text-sm text-[#85858C]">
                          {t("monthly")} : {option.monthlyPrice.toFixed(2)} AZN
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Add Note */}
            <div className="space-y-2">
              {!showNote ? (
                <button
                  onClick={() => setShowNote(true)}
                  className="flex items-center gap-2 text-sm text-black hover:text-black/80 transition-colors"
                >
                  <Plus className="size-4" />
                  {t("addNote")}
                </button>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm text-[#85858C]">{t("note")}</label>
                  <textarea
                    placeholder={t("notePlaceholder")}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full min-h-[100px] p-3 border border-[#8E8E93] rounded-[2px] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </div>
              )}
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <Checkbox
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                id="terms"
              />
              <label
                htmlFor="terms"
                className="text-sm text-black cursor-pointer"
              >
                {t("agreeToTerms")}{" "}
                <Link href="/terms-conditions" className="underline">
                  {t("termsAndConditions")}
                </Link>
              </label>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 border-[#8E8E93] rounded-[2px] text-black hover:bg-gray-50"
                asChild
              >
                <Link href="/basket">
                  <ArrowLeft className="size-4 mr-2" />
                  {t("backToBasket")}
                </Link>
              </Button>
              <Button
                className="flex-1 h-12 bg-black text-white rounded-[2px] hover:bg-black/90"
                disabled={!agreeToTerms || createOrderMutation.isPending}
                onClick={handleSubmitOrder}
              >
                {createOrderMutation.isPending
                  ? "Göndərilir..."
                  : t("continue")}
              </Button>
            </div>
          </div>
        </div>
        {/* Right Column - Basket Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white border border-[#F3F2F8] rounded-[2px] p-6 sticky top-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-black">
                {t("basketTitle")}
              </h2>
              <span className="text-sm text-[#85858C]">
                {basketProducts.length} {t("products")}
              </span>
            </div>
            {/* Products List */}
            <div className="space-y-4 mb-6 pb-6 border-b border-[#E5E5EA]">
              {basketProducts.map((item) => {
                const product = item.product;
                const productPrice =
                  typeof product.price === "string"
                    ? parseFloat(product.price)
                    : product.price;
                const discountPrice = product.discount_price
                  ? typeof product.discount_price === "string"
                    ? parseFloat(product.discount_price)
                    : product.discount_price
                  : null;
                const finalPrice = discountPrice || productPrice;

                return (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-[#FAFDFF] rounded-sm overflow-hidden shrink-0">
                      <Image
                        src={product.image || product.thumb_image}
                        alt={product.name}
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-black mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#85858C] mb-1">
                        {item.quantity} {t("quantity")}
                      </p>
                      <span className="font-semibold text-base text-black">
                        {finalPrice.toFixed(2)} AZN
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Promo Code Display */}
            {promoData && promoCode && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">
                      {t("promoCodeApplied")}: {promoCode}
                    </span>
                    <span className="text-sm text-blue-700">
                      ({Math.round((discount / productTotal) * 100)}%{" "}
                      {t("discount")})
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E5EA]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#85858C]">
                  {t("productPrice")}
                </span>
                <span className="text-sm text-black">
                  {productTotal.toFixed(2)} ₼
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#85858C]">{t("discount")}</span>
                <span className="text-sm text-blue-600">
                  -{discount.toFixed(2)} ₼
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#85858C]">{t("delivery")}</span>
                <span className="text-sm text-black">
                  {deliveryCost.toFixed(2)} ₼
                </span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base text-black">
                {t("finalPrice")}
              </span>
              <span className="font-semibold text-lg text-black">
                {finalTotal.toFixed(2)} ₼
              </span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
