import OrdersModel from "../../database/models/orders.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { OrderType } from "./orders.types.js";

export class OrdersServices {
  public static async createOrder(orderData: Partial<OrderType>) {
    const newOrder = await OrdersModel.create(orderData);
    return newOrder;
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
    filters: Record<string, string>
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
    orderData: Partial<OrderType>
  ) {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      orderData,
      {
        new: true,
      }
    );
    if (!updatedOrder) throw new AppError(404, "ORDER_NOT_FOUND");
    return updatedOrder;
  }

  public static async deleteOrder(orderId: string) {
    const deletedOrder = await OrdersModel.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new AppError(404, "ORDER_NOT_FOUND");
    return deletedOrder;
  }
}
