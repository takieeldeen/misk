import CartItemModel from "../../database/models/cart-items.model.js";
import CartModel from "../../database/models/cart.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import crypto from "crypto";

export class CartItemServices {
  // ✅ Add or update item
  public static async addItemToCart(
    userId: string,
    itemData: { variantId: string; quantity: number },
  ) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new AppError(404, "CART_NOT_FOUND");

    let cartItem = await CartItemModel.findOne({
      cart: cart._id,
      variantId: itemData.variantId,
    });

    if (cartItem) {
      // overwrite quantity (cleaner than += for consistency)
      cartItem.quantity = itemData.quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItemModel.create({
        cart: cart._id,
        variantId: itemData.variantId,
        quantity: itemData.quantity,
      });
    }

    // ✅ ALWAYS recalc from DB (single source of truth)
    await this.recalculateCartHash(cart._id.toString());

    return cartItem;
  }

  // ✅ Update quantity
  public static async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItemFromCart(itemId);
    }

    const cartItem = await CartItemModel.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true, runValidators: true },
    );

    if (!cartItem) throw new AppError(404, "CART_ITEM_NOT_FOUND");

    await this.recalculateCartHash(cartItem.cart.toString());

    return cartItem;
  }

  public static async removeItemFromCart(itemId: string) {
    const cartItem = await CartItemModel.findByIdAndDelete(itemId);
    if (!cartItem) throw new AppError(404, "CART_ITEM_NOT_FOUND");

    await this.recalculateCartHash(cartItem.cart.toString());

    return cartItem;
  }

  // ✅ Clear cart
  public static async clearCart(userId: string) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new AppError(404, "CART_NOT_FOUND");

    await CartItemModel.deleteMany({ cart: cart._id });

    await this.recalculateCartHash(cart._id.toString());
  }

  private static async recalculateCartHash(cartId: string) {
    const items = await CartItemModel.find({ cart: cartId }).lean();

    const normalized = items
      .map((item) => ({
        variantId: item.variantId.toString(),
        quantity: item.quantity,
      }))
      .sort((a, b) => a.variantId.localeCompare(b.variantId));

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(normalized))
      .digest("hex");

    await CartModel.findByIdAndUpdate(cartId, { cartHash: hash });

    return hash;
  }
}
