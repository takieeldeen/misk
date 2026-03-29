import CartItemModel from "./cart-items.model.js";
import CartModel from "../cart/cart.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { CreateCartItem } from "./cart-items.types.js";

export class CartItemServices {
  public static async addItemToCart(
    userId: string,
    itemData: { variantId: string; quantity: number }
  ) {
    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new AppError(404, "CART_NOT_FOUND");

    // Check if the item already exists in the cart
    let cartItem = await CartItemModel.findOne({
      cart: cart._id,
      variantId: itemData.variantId,
    });

    if (cartItem) {
      // If it exists, increment the quantity
      cartItem.quantity += itemData.quantity;
      await cartItem.save();
    } else {
      // Otherwise, create a new cart item
      cartItem = await CartItemModel.create({
        cart: cart._id,
        variantId: itemData.variantId,
        quantity: itemData.quantity,
      });

      // And add it to the cart's items array
      cart.items.push(cartItem._id as any);
      await cart.save();
    }

    return cartItem;
  }

  public static async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItemFromCart(itemId);
    }

    const cartItem = await CartItemModel.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!cartItem) throw new AppError(404, "CART_ITEM_NOT_FOUND");
    return cartItem;
  }

  public static async removeItemFromCart(itemId: string) {
    const cartItem = await CartItemModel.findByIdAndDelete(itemId);
    if (!cartItem) throw new AppError(404, "CART_ITEM_NOT_FOUND");

    // Also remove reference from the cart
    await CartModel.findByIdAndUpdate(cartItem.cart, {
      $pull: { items: itemId },
    });

    return cartItem;
  }

  public static async clearCart(userId: string) {
    const cart = await CartModel.findOne({ user: userId });
    await CartItemModel.deleteMany({ cart: cart?._id });
    await CartModel.findByIdAndUpdate(cart?._id, { items: [] });
  }
}
