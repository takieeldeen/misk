import mongoose from "mongoose";
import { PaymentType } from "./payments.types.js";

const PaymentSchema = new mongoose.Schema<PaymentType>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gateOrderId: {
      type: String, // ID returned from Paymob Order Registration
      required: true,
    },
    transactionId: {
      type: String, // ID returned from Paymob Transaction Callback
      unique: true,
      sparse: true,
    },
    amountInCents: {
      type: Number,
      required: true,
    },
    paidAmountInCents: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "VOIDED", "REFUNDED"],
      default: "PENDING",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CARD", "KIOSK", "MOBILE_WALLET", "VALU"],
      required: true,
    },
    paymentKey: {
      type: String, // The generated payment key token
    },
    rawCallbackData: {
      type: mongoose.Schema.Types.Mixed, // For debugging and audit
    },
    cardType: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;
