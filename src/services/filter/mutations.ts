import { useMutation } from "@tanstack/react-query";
import { FilterProducts } from "./api";
import { ApiResponse, FilterProductsPayload, Product } from "@/types";

const useFilterProductsMutation = () => {
    return useMutation<ApiResponse<Product[]>, Error, FilterProductsPayload>({
        mutationFn: (payload) => FilterProducts(payload),
    });
};
export { useFilterProductsMutation };