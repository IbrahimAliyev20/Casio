import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "./api";
import { ApiResponse, OrderDetail, CreateOrderPayload } from "@/types";
import { toastUtils } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CreateOrderMutationConfig {
  onSuccess?: (data: ApiResponse<OrderDetail>) => void;
  onError?: (error: Error) => void;
}


export const useCreateOrderMutation = (config?: CreateOrderMutationConfig) => {
  const queryClient = useQueryClient();
  const t = useTranslations("toast.order");

  return useMutation<
    ApiResponse<OrderDetail>,
    Error,
    CreateOrderPayload
  >({
    mutationFn: (order) => createOrder(order),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["completed-orders"] });
      queryClient.invalidateQueries({ queryKey: ["basket-products"] });
      toastUtils.success(t("createSuccess"));
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      toastUtils.error(t("createError"));
      config?.onError?.(error);
    },
  });
};
