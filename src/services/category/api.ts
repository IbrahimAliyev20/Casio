import { get } from "@/lib/api/client";
import { ApiResponse, CategoryResponse } from "@/types";

const getCategories = async (locale?: string) => {
  const response = await get<ApiResponse<CategoryResponse[]>>("/categories", { locale });
  return response;
};

export { getCategories };