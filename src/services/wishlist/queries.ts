import { queryOptions } from "@tanstack/react-query";
import { getWishlist } from "./api";

const getWishlistQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["wishlist-products"],
        queryFn: () => getWishlist(locale),
    });
}
export { getWishlistQuery };