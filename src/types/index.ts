export interface ApiResponse<T> {
  status: boolean;
  message: string;
  lang?: string;
  timestamp?: string;
  data: T;
}

  export interface AboutResponse {
    description: string;
    image: string;
}

export interface SliderResponse {
  image: string;
  title: string;
  description: string;
}

export interface CatalogResponse {
  id?: number;
  name: string;
  slug: string;
  image: string;
  thumb_image: string;
}

export interface ContactResponse {
  email: string;
  phone_1: string;
  phone_2: string;
  whatsapp_contact?: string;

}
export interface SocialMediaResponse {
  name: string;
  link: string;
  image: string;
}

export interface RegionResponse {
  name: string;
  id: number;
}
 
export interface StoreResponse {
  store_id?: number;
  title: string;
  address: string;
  phone: string;
  working_hours: string;
  image: string;
  thumb_image: string;
  region_id: number;
  region: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
}

export interface CategoryResponse {
  id?: number;
  name: string;
  slug?: string;
  category?: CategoryResponse[];
}

export type Category = CategoryResponse;

export interface Brand {
  id: number;
  name: string;
}

export interface FilterProductsPayload {
  category_ids?: string[];
  catalog_ids?: string[];
  attribute_value_ids?: string[];
  order_by?:'created_at' | 'price'  | 'popular';
  order_direction?: 'asc' | 'desc';
  min_price?: string | number;
  max_price?: string | number;  
  exists_in_stock?: number;
}

export interface Address {
  id: number;
  title: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  selected: number;
  is_selected: number;
} 
export interface AttributeResponse {
    name: string;
    attribute_values: AttributeValueResponse[];
}
export interface AttributeValueResponse {
    id?: string | number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: string | number;
    discount_price: string | number;
    category: string;
    slug: string;
    stock: number;
    image: string;
    thumb_image: string;
    attributes?: AttributeValue[];
    collection_products?: CollectionProduct[];
  }
  export interface AttributeValue {
      attribute: string;
      attribute_value: string;
  }
export interface CollectionProduct {
    slug: string;
    image: string;
    thumb_image: string;
}

export interface UserAddressResponse {
  id: number;
  country: string;
  city_or_region: string;
  address_title: string;
  address: string;
  post_code: string;
  name: string;
  phone: string;
  email: string;
  store_id?: number;
}
export interface BasketItem {
  quantity: number;
  product: Product;
}
export interface PrivacyPolicyResponse {
  title: string;
  description: string;
  slug: string;
}
export interface TermsOfServiceResponse {
  title: string;
  description: string;
  slug: string;
}
export interface FaqResponse {
  question: string;
  answer: string;
}


export interface Order {
  id: number;
  order_number: string;
  order_date: string;
  total_price?: number;
  status: {
    value: number;
    label: string;
  };
  order_items_count: number;
  items: {
    id?: number;
    name?: string;
    title?: string;
    image: string;
    thumb_image: string;
    price?: number;
    quantity?: number;
  }[];
}


export interface Promocode {
  product_price: number;
  promocode_price: number;
  promocode_id: number;
}




export interface OrderDetail {
  order_number: string;
  order_date: string;
  full_name: string;
  phone: string;
  total_price: string;
  status: OrderDetailStatus;
  delivery_type: OrderDetailDeliveryType;
  payment_type: OrderDetailPaymentType;
  promocode?: OrderDetailPromocode;
  order_items_count: number;
  order_items: OrderDetailItem[];
  delivery_date?: string;
  address?: {
    city_or_region?: string;
    address?: string;
    post_code?: string;
    id?: number;
    country?: string;
    address_title?: string;
  };
  delivery_cost?: string;
  note?: string;
}

export interface OrderDetailStatus {
  value: number;
  label: string;
}

export interface OrderDetailDeliveryType {
  value: number;
  label: string;
}

export interface OrderDetailPaymentType {
  value: number;
  label: string;
}

export interface OrderDetailPromocode {
  name: string;
  discount: number;
}

export interface OrderDetailProduct {
  id: number;
  name: string;
  price: string;
  discount_price: string;
  category: string;
  slug: string;
  stock: number;
  image: string;
  thumb_image: string;
}

export interface OrderDetailItem {
  product: OrderDetailProduct;
  quantity: number;
  price: string;
  discount_price: string;
}

export interface CreateOrderPayload {
  full_name: string;
  phone: string;
  delivery_type: number;
  payment_type: number;
  address_id?: number;
  city?: string;
  post_code?: string;
  address?: string;
  store_id?: number;
  installment_month?: number;
  note?: string;
  promocode_id?: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
export interface SubscribeResponse {
  email: string;
}