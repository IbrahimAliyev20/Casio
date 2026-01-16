"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Container from "@/components/shared/container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RegionResponse, StoreResponse } from "@/types";
import { getStoresQuery } from "@/services/contact/queries";

interface CasioStoresProps {
  regions?: RegionResponse[];
}

// Helper function to convert region name to slug
const regionNameToSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export default function CasioStores({ regions = [] }: CasioStoresProps) {
  const t = useTranslations("contact.stores");
  const locale = useLocale();
  
  // Create a map of slug to region ID
  const regionMap = useMemo(() => {
    const map = new Map<string, number>();
    regions.forEach((region) => {
      const slug = regionNameToSlug(region.name);
      map.set(slug, region.id);
    });
    return map;
  }, [regions]);
  
  const [activeTab, setActiveTab] = useState<string>("all");

  // Get the selected region ID
  const selectedRegionId = activeTab === "all" ? null : regionMap.get(activeTab);

  // Fetch stores for the selected region
  const { data: storesData, isLoading } = useQuery(
    selectedRegionId !== undefined && selectedRegionId !== null
      ? getStoresQuery(selectedRegionId, locale)
      : {
          queryKey: ["stores", "all", locale],
          queryFn: async () => {
            // Fetch stores for all regions when "all" is selected
            if (regions.length === 0) {
              return {
                status: true,
                message: "Success",
                data: [],
              };
            }
            const { getStores } = await import("@/services/contact/api");
            const allStoresPromises = regions.map((region) => getStores(region.id, locale));
            const allStoresResults = await Promise.all(allStoresPromises);
            const allStores = allStoresResults.flatMap((result) => result.data || []);
            return {
              status: true,
              message: "Success",
              data: allStores,
            };
          },
          enabled: regions.length > 0,
        }
  );

  const stores: StoreResponse[] = storesData?.data || [];
  const workingHours = t("workingHours");

  return (
    <div className="bg-white py-8 md:py-12 lg:py-20">
      <Container>
        <div className="space-y-4 md:space-y-8">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
            {t("title")}
          </h2>

          {/* Tabs Navigation - Scrollable on mobile */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="h-auto bg-transparent p-0 gap-0 border-b border-[#E5E5EA] rounded-none inline-flex min-w-max md:flex md:min-w-0 w-full">
                <TabsTrigger
                  value="all"
                  className={cn(
                    "data-[state=active]:shadow-none px-0 py-2 md:py-3 mr-4 sm:mr-6 md:mr-8 text-sm md:text-base font-normal rounded-none border-b-2 border-transparent data-[state=active]:border-b-black data-[state=active]:text-black data-[state=active]:bg-transparent text-[#85858C] hover:text-black transition-colors whitespace-nowrap"
                  )}
                >
                  {t("tabs.all")}
                </TabsTrigger>
                {regions.map((region) => {
                  const slug = regionNameToSlug(region.name);
                  return (
                    <TabsTrigger
                      key={region.name}
                      value={slug}
                      className={cn(
                        "data-[state=active]:shadow-none px-0 py-2 md:py-3 mr-4 sm:mr-6 md:mr-8 text-sm md:text-base font-normal rounded-none border-b-2 border-transparent data-[state=active]:border-b-black data-[state=active]:text-black data-[state=active]:bg-transparent text-[#85858C] hover:text-black transition-colors whitespace-nowrap"
                      )}
                    >
                      {region.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </Tabs>

          {/* Store Cards Grid */}
          <div className="mt-4 md:mt-8">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                {t("loading")}
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t("noStores")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stores.map((store, index) => (
                  <div
                    key={store.region_id ? `${store.region_id}-${index}` : index}
                    className="bg-white border border-[#E5E5EA] rounded-sm overflow-hidden flex flex-col"
                  >
                    {/* Store Image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#FAFDFF]">
                      <Image
                        src={store.image || store.thumb_image || "/images/magazafoto.jpg"}
                        alt={store.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>

                    {/* Store Info */}
                    <div className="p-3 md:p-4 space-y-1.5 md:space-y-2 flex flex-col flex-1">
                      <h3 className="font-bold text-sm md:text-base leading-5 md:leading-6 text-black">
                        {store.title}
                      </h3>
                      <p className="text-sm md:text-base leading-5 md:leading-6 text-black">
                        {store.address}
                      </p>
                      <p className="text-sm md:text-base leading-5 md:leading-6 text-black">
                        {store.phone}
                      </p>
                      <Link
                        href="#"
                        className="text-sm md:text-base leading-5 md:leading-6 text-[#003297] transition-colors mt-auto"
                      >
                        {store.working_hours || workingHours}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
