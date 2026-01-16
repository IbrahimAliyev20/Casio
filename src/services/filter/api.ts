import { post } from "@/lib/api";
import { ApiResponse, FilterProductsPayload, Product } from "@/types";

const FilterProducts = async (payload: FilterProductsPayload) => {
  // Convert min_price and max_price to strings if they are numbers
  // API expects them as strings (e.g., "1.00", "7.00")
  // Also remove undefined values to avoid serialization issues
  const formattedPayload: Record<string, unknown> = {};
  
  // Only include defined values
  if (payload.category_ids && payload.category_ids.length > 0) {
    formattedPayload.category_ids = payload.category_ids;
  }
  if (payload.catalog_ids && payload.catalog_ids.length > 0) {
    formattedPayload.catalog_ids = payload.catalog_ids;
  }
  if (payload.attribute_value_ids && payload.attribute_value_ids.length > 0) {
    formattedPayload.attribute_value_ids = payload.attribute_value_ids;
  }
  if (payload.min_price !== undefined) {
    formattedPayload.min_price = typeof payload.min_price === 'number' 
      ? payload.min_price.toFixed(2) 
      : payload.min_price;
  }
  if (payload.max_price !== undefined) {
    formattedPayload.max_price = typeof payload.max_price === 'number'
      ? payload.max_price.toFixed(2)
      : payload.max_price;
  }
  if (payload.exists_in_stock !== undefined) {
    formattedPayload.exists_in_stock = payload.exists_in_stock;
  }

  // Ensure order_by is a valid string, not an array
  if (payload.order_by !== undefined && payload.order_by !== null) {
    // If somehow order_by is an array, take the first element
    if (Array.isArray(payload.order_by)) {
      console.warn('order_by is an array, taking first element:', payload.order_by);
      formattedPayload.order_by = payload.order_by[0];
    } else if (typeof payload.order_by === 'string') {
      formattedPayload.order_by = payload.order_by;
    }
  }
  
  if (payload.order_direction !== undefined && payload.order_direction !== null) {
    if (Array.isArray(payload.order_direction)) {
      console.warn('order_direction is an array, taking first element:', payload.order_direction);
      formattedPayload.order_direction = payload.order_direction[0];
    } else if (typeof payload.order_direction === 'string') {
      formattedPayload.order_direction = payload.order_direction;
    }
  }


  const response = await post<ApiResponse<Product[]>>(
    `/products-filter`,
    formattedPayload
  );
  return response;
};

export { FilterProducts };
