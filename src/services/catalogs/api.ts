import { get } from "@/lib/api";
import { ApiResponse, CatalogResponse } from "@/types";

const getCatalogs = async ( locale?: string ) => {
  const response = await get<ApiResponse<CatalogResponse[]>>("/catalogs", { locale });
  return response;
};  
export { getCatalogs }; 