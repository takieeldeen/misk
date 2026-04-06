import { OrderType } from "../orders/orders.types.js";
import { UserType } from "../users/user.types.js";

export const PaymentStatus = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "VOIDED",
  "REFUNDED",
];
export type PaymentStatusType = (typeof PaymentStatus)[number];
export interface PaymentType {
  _id: string;
  order: string | OrderType;
  user: string | UserType;
  gateOrderId: string;
  transactionId: string;
  amountInCents: number;
  currency: string;
  status: PaymentStatusType;
  paymentMethod: string;
  paymentKey: string;
  rawCallbackData: Record<string, unknown>;
  paidAmountInCents: number;
  cardType?: string;
  cardNumber?: string;
}
