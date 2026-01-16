import { post } from "@/lib/api";
import { ApiResponse, SubscribeResponse } from "@/types";

export const subscribe = async (data: { email: string }) => {
  const response = await post<ApiResponse<SubscribeResponse>>(
    "/subscribe",
    data
  );
  return response;
};  