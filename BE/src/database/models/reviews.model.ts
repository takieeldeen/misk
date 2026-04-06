import mongoose from "mongoose";
import { ReviewType } from "../../modules/reviews/reviews.types.js";

const ReviewSchema = new mongoose.Schema<ReviewType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const ReviewModel = mongoose.model<ReviewType>("Review", ReviewSchema);

export default ReviewModel;
