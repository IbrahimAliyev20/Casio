import { get } from "@/lib/api";
import { AboutResponse, ApiResponse } from "@/types";

const getAbout = async ( locale?: string ) => {
  const response = await get<ApiResponse<AboutResponse>>("/about", { locale });
  return response;
};  
export { getAbout };