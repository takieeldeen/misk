import { CartItemType, CreateCartItem } from "./cart-items.types.js";

export function createCartItemDto(body: any): CreateCartItem {
  return {
    cart: body?.cart?.trim(),
    variantId: body?.variantId?.trim(),
    quantity: Number(body?.quantity) || 1,
  };
}

export function transformCartItem(cartItem: any): CartItemType {
  return {
    _id: cartItem._id,
    cart: cartItem.cart,
    variantId: cartItem.variantId,
    quantity: cartItem.quantity,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
  };
}
