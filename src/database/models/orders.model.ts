import mongoose from "mongoose";
import { OrderType } from "../../modules/orders/orders.types.js";

const OrdersSchema = new mongoose.Schema<OrderType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amountInCents: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELED"],
      default: "PENDING",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "PAYPAL", "CASH_ON_DELIVERY"],
    },
    transactionRef: {
      type: String,
    },

    shipping_address: {
      full_name: String,
      phone: String,
      country: String,
      city: String,
      area: String,
      address_line_1: String,
      address_line_2: String,
      building_number: String,
      floor: String,
      apartment: String,
      postal_code: String,
      notes: String,
    },
    cartHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const OrdersModel = mongoose.model<OrderType>("Order", OrdersSchema);

export default OrdersModel;
