import mongoose, { Schema } from "mongoose";
import { OrderItemType } from "./orderItems.type.js";

export const OrderItemSchema = new Schema<OrderItemType>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: [true, "MISSING_PARAMETER_VARIANT"],
    },
    quantity: {
      type: Number,
      required: [true, "MISSING_PARAMETER_QUANTITY"],
      min: [1, "QUANTITY_MUST_BE_AT_LEAST_1"],
      default: 1,
    },
    unitPriceInCents: {
      type: Number,
      required: [true, "MISSING_PARAMETER_UNIT_PRICE"],
      min: [0, "UNIT_PRICE_MUST_BE_NON_NEGATIVE"],
      default: 0,
    },
    totalPriceInCents: {
      type: Number,
      required: [true, "MISSING_PARAMETER_TOTAL_PRICE"],
      min: [0, "TOTAL_PRICE_MUST_BE_NON_NEGATIVE"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

OrderItemSchema.pre("save", function () {
  this.totalPriceInCents = this.quantity * this.unitPriceInCents;
});
