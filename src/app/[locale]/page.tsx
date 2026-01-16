import CatalogSection from "@/components/home/CatalogSection";
import DiscountedProducts from "@/components/home/DiscountedProducts";
import HeroSection from "@/components/home/HeroSection";
import SelectedProducts from "@/components/home/SelectedProducts";
import { getServerLocale } from "@/lib/utils";
import { getServerQueryClient } from "@/providers/server";
import { getCatalogsQuery } from "@/services/catalogs/queries";
import { getSlidersQuery } from "@/services/slider/queries";




export default async function Home() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getSlidersQuery(locale)),
    queryClient.prefetchQuery(getCatalogsQuery(locale)),
  ]);

  const slidersData = queryClient.getQueryData(getSlidersQuery(locale).queryKey  );
  const catalogsData = queryClient.getQueryData(getCatalogsQuery(locale).queryKey  );

  const sliders = slidersData?.data;
  const catalogs = catalogsData?.data;

  return (
    <div>
      <HeroSection sliders={sliders} />
      <CatalogSection catalogs={catalogs} />
      <SelectedProducts />
      <DiscountedProducts />
    </div>
  );
}