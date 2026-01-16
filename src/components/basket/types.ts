import { ProductCardData } from "@/utils/productcarddata";

export interface BasketItem extends ProductCardData {
  quantity: number;
  selected: boolean;
}
