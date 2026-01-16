import { get } from "@/lib/api";
import { ApiResponse, SliderResponse } from "@/types";

const getSliders = async ( locale?: string ) => {
  const response = await get<ApiResponse<SliderResponse[]>>("/sliders", { locale });
  return response;
};  
export { getSliders };