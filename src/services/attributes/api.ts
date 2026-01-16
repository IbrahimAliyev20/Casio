import { get } from "@/lib/api";
import { ApiResponse, AttributeResponse } from "@/types";

const getAttributes = async (locale?: string) => {
  const response = await get<ApiResponse<AttributeResponse[]>>("/attributes", { locale });
  return response;
};

export { getAttributes };