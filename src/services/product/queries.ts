import { queryOptions } from "@tanstack/react-query";
import { getSpecialProducts, getDiscountedProducts, getProductDetails, getRelatedProducts } from "./api";

const getSpecialProductsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["special-products"],
        queryFn: () => getSpecialProducts(locale),
    });
}
const getDiscountedProductsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["discounted-products"],
        queryFn: () => getDiscountedProducts(locale),
    });
}

const getProductDetailsQuery = (slug: string, locale: string) => {
    return queryOptions({
        queryKey: ["product-details", slug],
        queryFn: () => getProductDetails(slug, locale),
    });
}
const getRelatedProductsQuery = (slug: string, locale: string) => {
    return queryOptions({
        queryKey: ["related-products", slug, locale],
        queryFn: () => getRelatedProducts(slug, locale),
    });
}
export { getSpecialProductsQuery, getDiscountedProductsQuery,  getProductDetailsQuery, getRelatedProductsQuery };