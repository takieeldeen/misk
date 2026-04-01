import { OrderType } from "../orders/orders.types.js";
import { ProductVariant } from "../variants/variants.type.js";

export interface OrderItemType {
  _id: string;
  order: string | OrderType;
  variant: string | ProductVariant;
  quantity: number;
  unitPriceInCents: number;
  totalPriceInCents: number;
  createdAt: Date;
  updatedAt: Date;
  reservedStock: Number;
}
