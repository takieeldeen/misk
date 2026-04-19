import { Schema, model } from "mongoose";
import { ProductType } from "../../modules/products/products.types.js";

const productSchema = new Schema<ProductType>(
  {
    nameAr: {
      type: String,
      required: [true, "NAME_REQUIRED"],
    },
    nameEn: {
      type: String,
      required: [true, "NAME_REQUIRED"],
    },
    descriptionAr: {
      type: String,
    },
    descriptionEn: {
      type: String,
    },
    content: String,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "NEUTRAL"],
      default: "NEUTRAL",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const ProductModel = model<ProductType>("Product", productSchema);

export default ProductModel;
