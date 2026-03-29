import mongoose from "mongoose";
import { BrandType } from "../../modules/brands/brands.type.js";

const BrandsSchema = new mongoose.Schema<BrandType>(
  {
    nameAr: {
      type: String,
      required: true,
      unique: true,
    },
    nameEn: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: String,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const BrandsModel = mongoose.model<BrandType>("Brand", BrandsSchema);

export default BrandsModel;
