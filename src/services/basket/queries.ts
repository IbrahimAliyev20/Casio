import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBasket } from "./api";
import { AxiosRequestConfig } from "axios";

interface BasketQueryConfig extends AxiosRequestConfig {
  locale?: string;
  enabled?: boolean;
}

/**
 * Query options for basket products
 * @param config - Optional config with locale and axios options
 */
const getBasketQuery = (config?: BasketQueryConfig) => {
  return queryOptions({
    queryKey: ["basket-products", config?.locale],
    queryFn: () => getBasket(config),
    enabled: config?.enabled !== false,
  });
};

/**
 * Hook to fetch basket products
 * @param config - Optional config with locale and axios options
 */
const useBasketQuery = (config?: BasketQueryConfig) => {
  return useQuery({
    ...getBasketQuery(config),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { getBasketQuery, useBasketQuery };