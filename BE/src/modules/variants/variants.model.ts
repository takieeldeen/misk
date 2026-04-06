import { model, Schema } from "mongoose";
import { ProductVariant } from "./variants.type.js";

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sizeMl: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

const ProductVariantModel = model<ProductVariant>(
  "ProductVariant",
  ProductVariantSchema,
);

export default ProductVariantModel;
