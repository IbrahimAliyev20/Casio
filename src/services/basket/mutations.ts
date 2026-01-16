import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToBasket,
  removeFromBasket,
} from "./api";
import { ApiResponse, BasketItem } from "@/types";
import { AxiosRequestConfig } from "axios";
import { toastUtils } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BasketMutationConfig extends AxiosRequestConfig {
  locale?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface AddToBasketVariables {
  productId: number;
  quantity: number;
  config?: BasketMutationConfig;
}

interface RemoveFromBasketVariables {
  productId: number;
  quantity: number;
  config?: BasketMutationConfig;
}

/**
 * Mutation hook to add product to basket
 */
export const useAddToBasketMutation = (config?: BasketMutationConfig) => {
  const queryClient = useQueryClient();
  const t = useTranslations("toast.basket");

  return useMutation<
    ApiResponse<BasketItem>,
    Error,
    AddToBasketVariables
  >({
    mutationFn: ({ productId, quantity, config: mutationConfig }) =>
      addToBasket(productId, quantity, mutationConfig || config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basket-products"] });
      toastUtils.success(t("addSuccess"));
      config?.onSuccess?.();
    },
    onError: (error) => {
      toastUtils.error(t("addError"));
      config?.onError?.(error);
    },
  });
};

/**
 * Mutation hook to remove product from basket
 */
export const useRemoveFromBasketMutation = (
  config?: BasketMutationConfig
) => {
  const queryClient = useQueryClient();
  const t = useTranslations("toast.basket");

  return useMutation<
    ApiResponse<BasketItem>,
    Error,
    RemoveFromBasketVariables
  >({
    mutationFn: ({ productId, quantity, config: mutationConfig }) =>
      removeFromBasket(productId, quantity, mutationConfig || config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basket-products"] });
      toastUtils.success(t("removeSuccess"));
      config?.onSuccess?.();
    },
    onError: (error) => {
      toastUtils.error(t("removeError"));
      config?.onError?.(error);
    },
  });
};
