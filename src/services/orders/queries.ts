import { queryOptions } from "@tanstack/react-query";
import { getCompletedOrders, getOrderDetails, getOrders } from "./api";

const getOrdersQuery = () => {
    return queryOptions({
        queryKey: ["orders"],
        queryFn: () => getOrders(),
    });
}

const getCompletedOrdersQuery = () => {
    return queryOptions({
        queryKey: ["completed-orders"],
        queryFn: () => getCompletedOrders(),
    });
}

const getOrderDetailsQuery = (orderId: string) => {
    return queryOptions({
        queryKey: ["order-details", orderId],
        queryFn: () => getOrderDetails(orderId),
    });
}
export { getOrdersQuery, getCompletedOrdersQuery, getOrderDetailsQuery };