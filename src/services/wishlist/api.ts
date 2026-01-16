import { get, post } from "@/lib/api";
import { ApiResponse, Product } from "@/types";

const getWishlist = async (locale?: string) => {
  const response = await get<ApiResponse<Product[]>>(
    "/wishlist-products",
    { locale }
  );
  return response;
};


const addToWishlist = async (productId: number) => {
  const response = await post<ApiResponse<Product>>(
    `/wishlist/add/${productId}`
  );
  return response;
};

const removeFromWishlist = async (productId: number) => {
  const response = await post<ApiResponse<Product>>(
    `/wishlist/remove/${productId}`
  );
  return response;
};

export { getWishlist, addToWishlist, removeFromWishlist };