import { BasketItem as ApiBasketItem } from "@/types";
import { BasketItem as ComponentBasketItem } from "@/components/basket/types";


export const transformBasketItem = (
  apiItem: ApiBasketItem
): ComponentBasketItem => {
  const { product, quantity } = apiItem;
  
  const productPrice = typeof product.price === 'string' 
    ? parseFloat(product.price) || 0 
    : product.price || 0;
  
  const discountPrice = product.discount_price 
    ? (typeof product.discount_price === 'string' 
        ? parseFloat(product.discount_price) || 0 
        : product.discount_price)
    : null;
  
  const finalPrice = discountPrice || productPrice;
  const originalPrice = discountPrice ? productPrice : undefined;
  
  return {
    id: product.id,
    image: product.image || product.thumb_image,
    title: product.name,
    price: finalPrice,
    originalPrice: originalPrice,
    href: `/products/${product.slug}`,
    category: product.category,
    quantity: typeof quantity === 'string' ? parseInt(quantity, 10) || 1 : quantity || 1,
    selected: true,
    outOfStock: product.stock === 0,
    isDiscounted: !!discountPrice && discountPrice < productPrice,
  };
};


export const transformBasketItems = (
  apiItems: ApiBasketItem[]
): ComponentBasketItem[] => {
  return apiItems.map(transformBasketItem);
};
