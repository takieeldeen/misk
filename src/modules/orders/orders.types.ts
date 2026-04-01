import { AddressType, UserType } from "../users/user.types.js";

export interface OrderType {
  _id: string;
  user: string | UserType;
  amountInCents: number;
  status: "PENDING" | "COMPLETED" | "CANCELED";
  paymentMethod: "CREDIT_CARD" | "PAYPAL" | "CASH_ON_DELIVERY";
  createdAt: Date;
  updatedAt: Date;
  transactionRef?: string;
  shipping_address: AddressType;
  cartHash?: string;
}
