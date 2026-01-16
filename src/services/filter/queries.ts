import { queryOptions } from "@tanstack/react-query";
import { FilterProducts } from "./api";
import { FilterProductsPayload } from "@/types";

const getFilteredProductsQuery = (payload: FilterProductsPayload) => {
    return queryOptions({
        queryKey: ["filtered-products", payload],
        queryFn: () => FilterProducts(payload),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export { getFilteredProductsQuery };
