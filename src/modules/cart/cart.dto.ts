import { CartType } from "./cart.types.js";

export interface CartCreationDto {
  user: string;
}

export function createCartDto(cart: any): CartType {
  return {
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}
