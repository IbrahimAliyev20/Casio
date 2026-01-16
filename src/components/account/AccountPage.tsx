"use client";

import  { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PersonalInfo from "./tabs/PersonalInfo";
import Addresses from "./tabs/addrestab/Addresses";
import { CircleUser, Box, MapPin, SquareCheckBig, LogOut } from "lucide-react";
import CompletedOrders from "./tabs/ordertab/CompletedOrders";
import Order from "./tabs/Order";
import { useLogoutMutation } from "@/services/auth/mutations";

function AccountPage() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowLogoutDialog(false);
      // Full page refresh after logout
      window.location.href = "/";
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <Tabs defaultValue="personal" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:hidden overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4">
              <TabsList className="inline-flex h-auto bg-white border border-[#F3F2F8] rounded-xl p-1 gap-1 min-w-max">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#565355] data-[state=active]:bg-[#F2F4F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none whitespace-nowrap"
                >
                  <CircleUser className="w-4 h-4" />
                  <span>Şəxsi</span>
                </TabsTrigger>
                <TabsTrigger
                  value="order"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#565355] data-[state=active]:bg-[#F2F4F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none whitespace-nowrap"
                >
                  <Box className="w-4 h-4" />
                  <span>Sifarişlər</span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed-orders"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#565355] data-[state=active]:bg-[#F2F4F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none whitespace-nowrap"
                >
                  <SquareCheckBig className="w-4 h-4" />
                  <span>Tamamlanan</span>
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#565355] data-[state=active]:bg-[#F2F4F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Ünvanlar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="hidden lg:block lg:col-span-1 md:min-h-[656px]">
              <div className="bg-white rounded-2xl px-4 py-8 h-full border border-[#F3F2F8]">
                <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0 gap-2">
                  <TabsTrigger
                    value="personal"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start text-[#565355] data-[state=active]:bg-[#F2F4F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none hover:bg-[#F2F4F8] transition-all duration-300 cursor-pointer"
                  >
                    <CircleUser className="w-5 h-5" />
                    <span>Şəxsi məlumatlar</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="order"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start text-[#565355] data-[state=active]:bg-[#F3F2F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none hover:bg-[#F2F4F8] transition-all duration-300 cursor-pointer"
                  >
                    <Box className="w-5 h-5" />
                    <span>Sifarişlərim</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed-orders"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start text-[#565355] data-[state=active]:bg-[#F3F2F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none hover:bg-[#F2F4F8] transition-all duration-300 cursor-pointer"
                  >
                    <SquareCheckBig className="w-5 h-5" />
                    <span>Tamamlanan sifarişlər</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="addresses"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start text-[#565355] data-[state=active]:bg-[#F3F2F8] data-[state=active]:text-[#242123] font-normal data-[state=active]:font-medium data-[state=active]:shadow-none hover:bg-[#F2F4F8] transition-all duration-300 cursor-pointer"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Ünvanlarım</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 border-t border-[#F3F2F8] pt-4">
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="w-full flex items-center gap-1.5 px-4 py-3 rounded-lg text-left justify-start text-[#565355] transition-colors hover:bg-gray-100 font-normal text-sm cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                    >
                      <path
                        d="M16.3333 9.33332V6.99999C16.3333 6.38115 16.0875 5.78766 15.6499 5.35007C15.2123 4.91249 14.6188 4.66666 14 4.66666H5.83333C5.21449 4.66666 4.621 4.91249 4.18342 5.35007C3.74583 5.78766 3.5 6.38115 3.5 6.99999V21C3.5 21.6188 3.74583 22.2123 4.18342 22.6499C4.621 23.0875 5.21449 23.3333 5.83333 23.3333H14C14.6188 23.3333 15.2123 23.0875 15.6499 22.6499C16.0875 22.2123 16.3333 21.6188 16.3333 21V18.6667M8.16667 14H24.5M24.5 14L21 10.5M24.5 14L21 17.5"
                        stroke="#565355"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Hesabdan çıxış</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="lg:hidden mb-3 flex justify-end">
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#565355] transition-colors hover:bg-gray-100 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M16.3333 9.33332V6.99999C16.3333 6.38115 16.0875 5.78766 15.6499 5.35007C15.2123 4.91249 14.6188 4.66666 14 4.66666H5.83333C5.21449 4.66666 4.621 4.91249 4.18342 5.35007C3.74583 5.78766 3.5 6.38115 3.5 6.99999V21C3.5 21.6188 3.74583 22.2123 4.18342 22.6499C4.621 23.0875 5.21449 23.3333 5.83333 23.3333H14C14.6188 23.3333 15.2123 23.0875 15.6499 22.6499C16.0875 22.2123 16.3333 21.6188 16.3333 21V18.6667M8.16667 14H24.5M24.5 14L21 10.5M24.5 14L21 17.5"
                      stroke="#565355"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Çıxış</span>
                </button>
              </div>

              <div className="bg-white min-h-[400px] md:min-h-[656px] rounded-xl lg:rounded-2xl border border-[#F3F2F8]">
                <TabsContent value="personal">
                  <PersonalInfo />
                </TabsContent>
                <TabsContent value="order">
                  <Order />
                </TabsContent>
                <TabsContent value="completed-orders">
                  <CompletedOrders />
                </TabsContent>
                <TabsContent value="addresses">
                  <Addresses />
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-[420px] rounded-[2px] px-6 py-8"
          >
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center mx-auto mb-6">
                <LogOut size={24} />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hesabdan çıxmaq istədiyinizə əminsiniz?
              </h2>

              <p className="text-sm text-gray-500 mb-8">
                Hesabdan çıxdıqdan sonra yenidən daxil olmalı olacaqsınız
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancelLogout}
                  disabled={logoutMutation.isPending}
                  className="h-11 border-gray-300 text-gray-700 rounded-none"
                >
                  Ləğv et
                </Button>

                <Button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="h-11 bg-black hover:bg-black/90 text-white rounded-none disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Gözləyin..." : "Hesabdan çıx"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AccountPage;
