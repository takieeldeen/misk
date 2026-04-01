import mongoose from "mongoose";
import CartItemModel from "../../database/models/cart-items.model.js";
import CartModel from "../../database/models/cart.model.js";
import OrdersModel from "../../database/models/orders.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { CartItemType } from "../cart-items/cart-items.types.js";
import { ProductVariant } from "../variants/variants.type.js";
import { OrderType } from "./orders.types.js";
import ProductVariantModel from "../variants/variants.model.js";
import OrderItemModel from "../orderItems/orderItems.model.js";
import { CartServices } from "../cart/cart.services.js";

export class OrdersServices {
  public static async checkout(userId: string) {
    await mongoose.connection.transaction(async () => {
      // 1. create new order from the user cart
      const userOrder = await this.createOrder({
        user: userId,
        status: "PENDING",
      });
      // 2. Deduct Stock from inventory
      await this.deductOrderStock(userOrder._id);
    });
  }

  public static async createOrder(orderData: Partial<OrderType>) {
    // 1. Get User Cart
    const userCart = await CartModel.findOne({ user: orderData.user });
    // 2. If the user has no cart throw error
    if (!userCart) throw new AppError(404, "CART_NOT_FOUND");
    // 3. If the cart is empty throw error
    const cartItems = await CartItemModel.find({ cart: userCart._id }).populate(
      "variantId",
    );
    if (cartItems.length === 0) throw new AppError(400, "CART_IS_EMPTY");
    // 4. Check stock for each cart item
    const isStockAvailable = this.checkStock(cartItems);
    if (!isStockAvailable) throw new AppError(400, "OUT_OF_STOCK");
    // 5. Find the latest failed or pending order for the current user
    const latestUnsuccessfulOrder = await OrdersModel.findOne({
      user: orderData.user,
      status: { $in: ["PENDING", "FAILED"] },
    }).sort({ createdAt: -1 });
    // 6. Check if the user has a previous order
    const hasPreviousOrder =
      !!latestUnsuccessfulOrder &&
      latestUnsuccessfulOrder.cartHash === userCart.cartHash;
    // 7. use the previous order if it exists otherwise create a new order
    let userOrder: OrderType;
    if (hasPreviousOrder) {
      userOrder = latestUnsuccessfulOrder;
      // 8. update the prices for existing order items
      const orderItems = await OrderItemModel.find({
        order: userOrder._id,
      }).populate("variant");
      for (const item of orderItems) {
        const variant = item.variant as any as ProductVariant;
        item.unitPriceInCents = variant.price;
        item.totalPriceInCents = variant.price * item.quantity;
        item.reservedStock = item.quantity;
        await item.save();
      }
      //  update the order total
      const orderTotal = this.calculateOrderTotal(cartItems);
      await OrdersModel.findByIdAndUpdate(userOrder._id, {
        amountInCents: orderTotal,
      });
    } else {
      //  create new order items
      const orderItems = cartItems.map((cartItem: CartItemType) => ({
        order: userOrder._id,
        variant: (cartItem.variantId as ProductVariant)._id,
        quantity: cartItem.quantity,
        unitPriceInCents: (cartItem.variantId as ProductVariant).price,
        totalPriceInCents:
          (cartItem.variantId as ProductVariant).price * cartItem.quantity,
        reservedStock: cartItem.quantity,
      }));
      await OrderItemModel.insertMany(orderItems);
      //  calculate the order total
      const orderTotal = this.calculateOrderTotal(cartItems);
      //  create the order
      userOrder = await OrdersModel.create({
        ...orderData,
        amountInCents: orderTotal,
        cartHash: userCart.cartHash,
      });
    }

    return userOrder;
  }

  public static async getOneOrder(orderId: string) {
    const order = await OrdersModel.findById(orderId).populate("user");
    //   .populate("orderItems");
    if (!order) throw new AppError(404, "ORDER_NOT_FOUND");
    return order;
  }

  public static async getPaginatedOrders(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string>,
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      status: filters.status
        ? filters.status
        : { $in: ["PENDING", "COMPLETED", "CANCELED"] },
    };

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    const brands = await OrdersModel.find(query)
      .skip(skip > 0 ? skip : 0)
      .limit(limit)
      .sort({ createdAt: -1 });
    return brands;
  }

  public static async getOrdersCount(filters: Record<string, string>) {
    const query: any = {
      status: filters.status
        ? filters.status
        : { $in: ["PENDING", "COMPLETED", "CANCELED"] },
    };
    const count = await OrdersModel.countDocuments(query);
    return count;
  }

  public static async updateOrder(
    orderId: string,
    orderData: Partial<OrderType>,
  ) {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      orderData,
      {
        new: true,
      },
    );
    if (!updatedOrder) throw new AppError(404, "ORDER_NOT_FOUND");
    return updatedOrder;
  }

  public static async deleteOrder(orderId: string) {
    const deletedOrder = await OrdersModel.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new AppError(404, "ORDER_NOT_FOUND");
    return deletedOrder;
  }

  private static checkStock(cartItems: CartItemType[]) {
    console.log(cartItems);
    for (const cartItem of cartItems) {
      const variant = cartItem.variantId as ProductVariant;
      if (variant.stock < cartItem.quantity) {
        return false;
      }
    }
    return true;
  }

  private static calculateOrderTotal(cartItems: CartItemType[]) {
    let total = 0;
    for (const cartItem of cartItems) {
      const variant = cartItem.variantId as ProductVariant;
      const unitPrice = variant.price;
      if (unitPrice < 0) throw new AppError(400, "INVALID_PRICE");
      const totalPrice = cartItem.quantity * unitPrice;
      total += totalPrice;
    }
    return total;
  }

  private static async deductOrderStock(orderId: string) {
    const orderItems = await OrderItemModel.find({
      order: orderId,
    });

    await Promise.all(
      orderItems.map(async (orderItem) => {
        // 1. Update the variant stock
        await ProductVariantModel.findByIdAndUpdate(orderItem.variant, {
          $inc: { stock: -orderItem.quantity },
        });

        // 2. Persist the reservedStock in the database record
        orderItem.reservedStock = orderItem.quantity;
        await orderItem.save();
      }),
    );
  }

  public static async restoreIdleStock() {
    const staleOrders = await OrdersModel.find({
      status: "PENDING",
      $or: [
        {
          createdAt: {
            $lt: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
        {
          updatedAt: {
            $lt: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
      ],
    });
    const staleOrderItems = await OrderItemModel.find({
      order: { $in: staleOrders.map((order) => order._id) },
      reservedStock: { $gt: 0 },
    });
    await Promise.all(
      staleOrderItems.map(async (orderItem) => {
        await ProductVariantModel.findByIdAndUpdate(orderItem.variant, {
          $inc: { stock: orderItem.quantity },
        });
        await OrderItemModel.findByIdAndUpdate(orderItem._id, {
          $set: { reservedStock: 0 },
        });
      }),
    );
  }
}
