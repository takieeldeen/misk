import { CartItemType } from "../cart-items/cart-items.types.js";
import { UserType } from "../users/user.types.js";

export interface CartType {
  _id: string;
  user: string | UserType;
  createdAt: Date;
  updatedAt: Date;
  cartHash: string;
}
