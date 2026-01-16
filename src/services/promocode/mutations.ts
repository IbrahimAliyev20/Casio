import { useMutation } from "@tanstack/react-query";
import { checkPromocode } from "./api";
import { ApiResponse, Promocode } from "@/types";
import { toastUtils } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PromocodeMutationConfig {
  onSuccess?: (data: ApiResponse<Promocode>) => void;
  onError?: (error: Error) => void;
}

interface CheckPromocodeVariables {
  promocode: string;
  items: { product_id: number, quantity: number }[];
}

/**
 * Mutation hook to check promocode
 */
export const useCheckPromocodeMutation = (
  config?: PromocodeMutationConfig
) => {
  const t = useTranslations("toast.promocode");

  return useMutation<
    ApiResponse<Promocode>,
    Error,
    CheckPromocodeVariables
  >({
    mutationFn: ({ promocode, items }) => checkPromocode(promocode, items),
    onSuccess: (data) => {
      toastUtils.success(t("checkSuccess"));
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      toastUtils.error(t("checkError"));
      config?.onError?.(error);
    },
  });
};
