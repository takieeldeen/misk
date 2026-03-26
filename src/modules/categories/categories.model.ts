import mongoose from "mongoose";
import { CategoryType } from "./categories.type.js";

const CategoriesSchema = new mongoose.Schema<CategoryType>(
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

const CategoriesModel = mongoose.model<CategoryType>("Categories", CategoriesSchema);

export default CategoriesModel;
