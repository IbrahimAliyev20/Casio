import { get } from "@/lib/api";
import { ApiResponse, Product } from "@/types";

const getSpecialProducts = async (locale?: string) => {
  const response = await get<ApiResponse<Product[]>>("/special-products", {
    locale,
  });
  return response;
};
const getDiscountedProducts = async (locale?: string) => {
  const response = await get<ApiResponse<Product[]>>("/discounted-products", {
    locale,
  });
  return response;
};

const getProductDetails = async (slug: string, locale?: string) => {
  const response = await get<ApiResponse<Product>>(`/product/${slug}`, {
    locale,
  });
  return response;
};

const getRelatedProducts = async (slug: string, locale?: string) => {
  const response = await get<ApiResponse<Product[]>>(`/related-products/${slug}`, {
    locale,
  });
  return response;
};
const searchProducts = async (search: string, locale?: string) => {
  const response = await get<ApiResponse<Product[]>>(`/products-search`, {
    locale,
    params: { search },
  });
  return response;
};


export { getSpecialProducts, getDiscountedProducts, getProductDetails, getRelatedProducts, searchProducts };
