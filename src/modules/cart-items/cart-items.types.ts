import { CartType } from "../cart/cart.types.js";
import { ProductVariant } from "../variants/variants.type.js";

export interface CartItemType {
  _id: string;
  cart: string | CartType;
  variantId: string | ProductVariant;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCartItem {
  cart: string;
  variantId: string;
  quantity: number;
}
