import { ApiResponse, SubscribeResponse } from "@/types";
import { subscribe } from "./api";
import { useMutation } from "@tanstack/react-query";

const useSubscribeMutation = () => {
  return useMutation<ApiResponse<SubscribeResponse>, Error, { email: string }>({
    mutationFn: (data) => subscribe(data),
  });
};
export { useSubscribeMutation };
