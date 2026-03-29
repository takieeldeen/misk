import { OrderItemType } from "./orderItems.type.js";

export function createOrderItemDto(order: any): Partial<OrderItemType> {
  const orderObj =
    (order as any).toObject instanceof Function
      ? (order as any).toObject()
      : order;

  const orderInfo: Partial<OrderItemType> = {};
  if (orderObj.order) orderInfo.order = orderObj.order;
  if (orderObj.variant) orderInfo.variant = orderObj.variant;
  if (orderObj.quantity) orderInfo.quantity = Number(orderObj.quantity);
  if (orderObj.unitPriceInCents)
    orderInfo.unitPriceInCents = Number(orderObj.unitPriceInCents);
  const { ...userInfo } = orderObj;

  return userInfo;
}
