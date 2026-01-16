"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSelector from "../shared/language-selector";
import { navigationItems } from "@/utils/static";
import Container from "../shared/container";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import { LoginModal } from "../auth/LoginModal";
import { RegisterModal } from "../auth/RegisterModal";
import { OTPModal } from "../auth/OTPModal";
import { SetPasswordModal } from "../auth/SetPasswordModal";
import { SuccessModal } from "../auth/SuccessModal";
import SendForgetMail from "../auth/forgetpassword/SendForgetMail";
import NewPasswordForget from "../auth/forgetpassword/NewPasswordForget";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";
import { useSendOtpMutation, useSendForgetMailMutation } from "@/services/auth/mutations";
import { useBasketQuery } from "@/services/basket/queries";
import { getWishlistQuery } from "@/services/wishlist/queries";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/services/product/api";
import { useLocale } from "next-intl";
import { Product } from "@/types";

export function Header() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const locale = useLocale();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isSetPasswordModalOpen, setIsSetPasswordModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [isSendForgetMailModalOpen, setIsSendForgetMailModalOpen] = useState(false);
  const [isNewPasswordForgetModalOpen, setIsNewPasswordForgetModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordToken, setForgotPasswordToken] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [basketCount, setBasketCount] = useState(0);
  const [hasToken, setHasToken] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sendOtpMutation = useSendOtpMutation();
  const sendForgetMailMutation = useSendForgetMailMutation();

  // Fetch basket data to get count
  const { data: basketData } = useBasketQuery({ locale });

  // Fetch wishlist data to get count
  const { data: wishlistData } = useQuery(getWishlistQuery(locale));

  // Fetch search results when there's a search query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search", searchQuery, locale],
    queryFn: () => searchProducts(searchQuery, locale),
    enabled: !!searchQuery && searchQuery.length > 0,
  });


  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateFavoritesCount = (): void => {
        if (wishlistData?.data) {
          setFavoritesCount(wishlistData.data.length);
        } else {
          setFavoritesCount(0);
        }
      };

      const updateBasketCount = (): void => {
        if (basketData?.data) {
          const totalItems = basketData.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setBasketCount(totalItems);
        } else {
          setBasketCount(0);
        }
      };

      const checkToken = (): void => {
        const token = Cookies.get("access_token");
        setHasToken(!!token);
      };

      updateFavoritesCount();
      updateBasketCount();
      checkToken();

      window.addEventListener("favoritesUpdated", updateFavoritesCount);
      window.addEventListener("basketUpdated", updateBasketCount);
      window.addEventListener("storage", (e) => {
        if (e.key === "access_token" || !e.key) {
          checkToken();
        }
        updateFavoritesCount();
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          updateFavoritesCount();
          updateBasketCount();
          checkToken();
        }
      });

      // Listen for custom token update events
      const handleTokenUpdate = (): void => checkToken();
      window.addEventListener("tokenUpdated", handleTokenUpdate);

      // Listen for open login modal event
      const handleOpenLoginModal = (): void => {
        setIsLoginModalOpen(true);
      };
      window.addEventListener("openLoginModal", handleOpenLoginModal);

      return () => {
        window.removeEventListener("favoritesUpdated", updateFavoritesCount);
        window.removeEventListener("basketUpdated", updateBasketCount);
        window.removeEventListener("storage", updateFavoritesCount);
        window.removeEventListener("tokenUpdated", handleTokenUpdate);
        window.removeEventListener("openLoginModal", handleOpenLoginModal);
      };
    }
  }, [basketData, wishlistData]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b border-[#F1F2F6] bg-white sticky top-0 z-50">
      <Container>
        <div className="flex  items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-[90px]">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#14171A] hover:opacity-70 transition-opacity p-1"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link href="/">
              <Image
                src="/images/logo.jpg"
                alt="Casio Logo"
                width={100}
                height={100}
                className="object-contain w-16 h-16 md:w-[100px] md:h-[100px]"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/" && pathname === "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-[325] transition-colors text-sm lg:text-base ${
                      isActive
                        ? "text-[#14171A] underline underline-offset-6"
                        : "text-text-primary hover:text-[#14171A]"
                    }`}
                  >
                    {t(item.label)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-6">

            
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t("search") ?? "Search"}
                    className="w-[200px] md:w-[250px] border border-[#E1E3E8] px-3 py-1 text-sm focus:outline-none focus:border-[#14171A] transition-colors rounded-[2px]"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-[#14171A] hover:opacity-70 transition-opacity"
                    aria-label="Search"
                    onClick={() => setIsSearchOpen((prev) => !prev)}
                  >
                    <Image
                      src="/icons/lupa.svg"
                      alt="Search"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="text-[#14171A] hover:opacity-70 transition-opacity"
                  aria-label="Search"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                >
                  <Image
                    src="/icons/lupa.svg"
                    alt="Search"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </button>
              )}
              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-1 w-[300px] md:w-[400px] bg-white border border-[#E1E3E8] rounded-[2px] shadow-md z-50">
                  {searchQuery && (
                    <>
                      {isSearching ? (
                        <div className="px-3 py-4 text-center">
                          <p className="text-sm text-gray-500">Searching...</p>
                        </div>
                      ) : searchResults?.data && searchResults.data.length > 0 ? (
                        <div className="max-h-[300px] overflow-y-auto">
                          {searchResults.data.map((product: Product) => (
                            <Link
                              key={product.id}
                              href={product.slug || `/product/${product.id}`}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-[#F2F4F8] transition-colors"
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                            >
                              <Image
                                src={product.image || "/images/kataloqbaby.png"}
                                alt={product.name}
                                width={50}
                                height={50}
                                className="w-12 h-12 object-contain"
                              />
                              <div>
                                <p className="text-sm font-medium text-[#14171A]">{product.name}</p>
                                <p className="text-xs text-[#a92c2b]">{product.price}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="px-3 py-2 text-sm text-gray-500">No results found</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {hasToken && (
              <>
                <Link 
                  href="/favorites"
                  className="relative text-[#14171A] hover:opacity-70 transition-opacity"
                  aria-label="Wishlist"
                >
                  <Image
                    src="/icons/heart.svg"
                    alt="Wishlist"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#a92c2b] text-white text-[10px] font-semibold rounded-full w-4 h-4 md:w-4 md:h-4 flex items-center justify-center">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/basket"
                  className="relative text-[#14171A] hover:opacity-70 transition-opacity"
                >
                  <Image
                    src="/icons/shopping-bag.svg"
                    alt="Cart"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  {basketCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#a92c2b] text-white text-[10px] font-semibold rounded-full w-4 h-4 md:w-4 md:h-4 flex items-center justify-center">
                      {basketCount > 99 ? '99+' : basketCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            {hasToken ? (
              <Link href="/account">
                <Button 
                  className="bg-[#14171A] text-white hover:bg-[#14171A]/90 gap-2 py-2 px-3 md:py-4 md:px-6 rounded-[2px] text-sm md:text-base"
                >
                  <Image
                    src="/icons/user-circle.svg"
                    alt="User"
                    width={20}
                    height={20}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                  <span className="hidden sm:inline">{t("account")}</span>
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#14171A] text-white hover:bg-[#14171A]/90 gap-2 py-2 px-3 md:py-4 md:px-6 rounded-[2px] text-sm md:text-base"
              >
                <Image
                  src="/icons/user-circle.svg"
                  alt="User"
                  width={20}
                  height={20}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                <span className="hidden sm:inline">{t("login")}</span>
              </Button>
            )}
          </div>
        </div>
      </Container>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#F1F2F6]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/images/logo.jpg"
                alt="Casio Logo"
                width={80}
                height={80}
                className="object-contain w-16 h-16"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#14171A] hover:opacity-70 transition-opacity p-1"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "text-[#14171A] bg-[#F2F4F8]"
                      : "text-text-primary hover:text-[#14171A] hover:bg-[#F2F4F8]"
                  }`}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#F1F2F6] space-y-4">
            <div className="sm:hidden">
              <LanguageSelector />
            </div>
            {hasToken ? (
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full bg-[#14171A] text-white hover:bg-[#14171A]/90 gap-2 py-3 px-4 rounded-[2px]"
                >
                  <Image
                    src="/icons/user-circle.svg"
                    alt="User"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  {t("account")}
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full bg-[#14171A] text-white hover:bg-[#14171A]/90 gap-2 py-3 px-4 rounded-[2px]"
              >
                <Image
                  src="/icons/user-circle.svg"
                  alt="User"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      </div>
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen}
        onSwitchToRegister={() => setIsRegisterModalOpen(true)}
        onSwitchToForgotPassword={() => setIsSendForgetMailModalOpen(true)}
        onLoginSuccess={() => {
          const token = Cookies.get("access_token");
          setHasToken(!!token);
          // Dispatch event for other components that might need to know
          window.dispatchEvent(new Event("tokenUpdated"));
        }}
      />
      <SendForgetMail
        open={isSendForgetMailModalOpen}
        onOpenChange={setIsSendForgetMailModalOpen}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
        onSuccess={(email) => {
          setForgotPasswordEmail(email);
          setRegisteredEmail(""); // Clear registration email when switching to forgot password
          setIsSendForgetMailModalOpen(false);
          setIsOTPModalOpen(true);
        }}
      />
      <RegisterModal
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
        onSuccess={(email) => {
          setRegisteredEmail(email);
          setForgotPasswordEmail(""); // Clear forgot password email when switching to registration
          setIsRegisterModalOpen(false);
          setIsOTPModalOpen(true);
        }}
      />
      <OTPModal
        open={isOTPModalOpen}
        onOpenChange={setIsOTPModalOpen}
        email={registeredEmail || forgotPasswordEmail}
        type={forgotPasswordEmail ? "forgotPassword" : "register"}
        onSuccess={(token) => {
          if (forgotPasswordEmail) {
            setForgotPasswordToken(token);
            setIsOTPModalOpen(false);
            setIsNewPasswordForgetModalOpen(true);
          } else {
            setRegistrationToken(token);
            setIsOTPModalOpen(false);
            setIsSetPasswordModalOpen(true);
          }
        }}
        onResend={async () => {
          try {
            if (forgotPasswordEmail) {
              await sendForgetMailMutation.mutateAsync({ email: forgotPasswordEmail });
              console.log("Forgot password OTP resent to:", forgotPasswordEmail);
            } else {
              await sendOtpMutation.mutateAsync({ email: registeredEmail });
              console.log("OTP resent to:", registeredEmail);
            }
          } catch (error) {
            console.error("Failed to resend OTP:", error);
          }
        }}
      />
      <NewPasswordForget
        open={isNewPasswordForgetModalOpen}
        onOpenChange={setIsNewPasswordForgetModalOpen}
        token={forgotPasswordToken}
        email={forgotPasswordEmail}
        onSuccess={() => {
          setIsNewPasswordForgetModalOpen(false);
          setIsLoginModalOpen(true);
          // Reset forgot password state
          setForgotPasswordEmail("");
          setForgotPasswordToken("");
        }}
      />
      <SetPasswordModal
        open={isSetPasswordModalOpen}
        onOpenChange={setIsSetPasswordModalOpen}
        token={registrationToken}
        email={registeredEmail}
        onSuccess={() => {
          setIsSetPasswordModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
      <SuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        onLogin={() => setIsLoginModalOpen(true)}
      />
    </header>
  );
}