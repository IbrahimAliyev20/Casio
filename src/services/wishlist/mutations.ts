import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "./api";
import { ApiResponse, Product } from "@/types";
import { toastUtils } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toast.wishlist");

  return useMutation<ApiResponse<Product>, Error, number>({
    mutationFn: (productId) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
      toastUtils.success(t("addSuccess"));
    },
    onError: () => {
      toastUtils.error(t("addError"));
    },
  });
};

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toast.wishlist");

  return useMutation<ApiResponse<Product>, Error, number>({
    mutationFn: (productId) => removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
      toastUtils.success(t("removeSuccess"));
    },
    onError: () => {
      toastUtils.error(t("removeError"));
    },
  });
};
