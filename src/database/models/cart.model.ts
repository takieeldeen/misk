import { model, Schema } from "mongoose";
import { CartType } from "../../modules/cart/cart.types.js";

const CartSchema = new Schema<CartType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartHash: {
      type: String,
    },
  },
  { timestamps: true },
);

const CartModel = model<CartType>("Cart", CartSchema);

export default CartModel;
