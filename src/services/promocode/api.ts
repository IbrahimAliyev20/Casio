import { post } from "@/lib/api";
import { ApiResponse, Promocode } from "@/types";

const checkPromocode = async (promocode: string, items: { product_id: number, quantity: number }[]) => {
    const response = await post<ApiResponse<Promocode>>(`/promocode-check`, { promocode: promocode , items: items });
    return response;
};

export { checkPromocode };