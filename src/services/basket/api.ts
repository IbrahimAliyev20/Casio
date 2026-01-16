import { get, post } from "@/lib/api";
import { ApiResponse, BasketItem } from "@/types";
import { AxiosRequestConfig } from "axios";

interface BasketConfig extends AxiosRequestConfig {
  locale?: string;
}

// Mövcud funksiyalar
const getBasket = async (config?: BasketConfig) => {
  const response = await get<ApiResponse<BasketItem[]>>(
    "/basket-products",
    config
  );
  return response;
};

export const postForm = async <T>(
  url: string,
  data: Record<string, string | number | boolean>,
  config?: BasketConfig
): Promise<T> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return post<T>(url, formData, config);
};

const addToBasket = async (
  productId: number,
  quantity: number,
  config?: BasketConfig
) => {
  const response = await postForm<ApiResponse<BasketItem>>(
    `/basket/add/${productId}`,
    { quantity },
    config
  );
  return response;
};

const removeFromBasket = async (
  productId: number,
  quantity: number,
  config?: BasketConfig
) => {
  const response = await postForm<ApiResponse<BasketItem>>(
    `/basket/remove/${productId}`,
    { quantity },
    config
  );
  return response;
};

export {
  getBasket,
  addToBasket,
  removeFromBasket,
};