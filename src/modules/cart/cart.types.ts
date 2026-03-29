import { CartItemType } from "../cart-items/cart-items.types.js";
import { UserType } from "../users/user.types.js";

export interface CartType {
  _id: string;
  user: string | UserType;
  items: string[] | CartItemType[];
  createdAt: Date;
  updatedAt: Date;
}
