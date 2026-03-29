import CartModel from "./cart.model.js";
import { AppError } from "../../utilities/utilis/error.js";

export class CartServices {
  public static async createCart(userId: string) {
    const existingCart = await CartModel.findOne({ user: userId });
    if (existingCart) return existingCart;
    const cart = await CartModel.create({ user: userId });
    return cart;
  }

  public static async getUserCart(userId: string) {
    const cart = await CartModel.findOne({ user: userId })
      .populate("user")
      .populate({
        path: "items",
        populate: {
          path: "variantId",
        },
      });
    if (!cart) throw new AppError(404, "CART_NOT_FOUND");
    return cart;
  }

  public static async deleteCart(userId: string) {
    const cart = await CartModel.findOneAndDelete({ user: userId });
    if (!cart) throw new AppError(404, "CART_NOT_FOUND");
    return cart;
  }
}
