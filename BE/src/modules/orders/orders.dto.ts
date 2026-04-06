import { OrderType } from "./orders.types.js";

export function createOrderDto(order: any): Partial<OrderType> {
  const userObj =
    (order as any).toObject instanceof Function
      ? (order as any).toObject()
      : order;

  const orderInfo: Partial<OrderType> = {};
  const { ...userInfo } = userObj;

  return userInfo;
}
