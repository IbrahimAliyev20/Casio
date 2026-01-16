import { get, post } from "@/lib/api";
import { ApiResponse, Order, OrderDetail, CreateOrderPayload } from "@/types";

const getOrders = async () => {
  const response = await get<ApiResponse<Order[]>>("/user-orders");
  return response;
};

const getCompletedOrders = async () => {
  const response = await get<ApiResponse<Order[]>>("/user-completed-orders");
  return response;
};
 
const getOrderDetails = async (orderId: string) => {
  const response = await get<ApiResponse<OrderDetail>>(`/order-detail/${orderId}`);
  return response;
};

const createOrder = async (order: CreateOrderPayload) => {
  const response = await post<ApiResponse<OrderDetail>>("/order", order);
  return response;
};


export { getOrders, getCompletedOrders, getOrderDetails, createOrder, };