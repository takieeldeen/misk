import { model, Schema } from "mongoose";
import { CartItemType } from "./cart-items.types.js";

const CartItemSchema = new Schema<CartItemType>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true },
);

const CartItemModel = model<CartItemType>("CartItem", CartItemSchema);

export default CartItemModel;
