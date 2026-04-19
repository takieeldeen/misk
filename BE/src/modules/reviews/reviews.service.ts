import ReviewModel from "../../database/models/reviews.model.js";
import { ReviewCreationDto, ReviewUpdateDto } from "./reviews.types.js";
import { AppError } from "../../utilities/utilis/error.js";
import mongoose from "mongoose";

export class ReviewService {
  public static async createReview(reviewData: ReviewCreationDto) {
    const review = await ReviewModel.create(reviewData);
    return review;
  }

  public static async getReviewById(id: string) {
    const review = await ReviewModel.findById(id);
    if (!review) throw new AppError(404, "REVIEW_NOT_FOUND");
    return review;
  }

  public static async getProductReviews(productId: string) {
    const reviews = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                imageUrl: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "orderitems",
          let: { reviewerId: "$user._id" },
          pipeline: [
            {
              $lookup: {
                from: "orders",
                localField: "order",
                foreignField: "_id",
                as: "orderInfo",
              },
            },
            { $unwind: "$orderInfo" },
            {
              $lookup: {
                from: "productvariants",
                localField: "variant",
                foreignField: "_id",
                as: "variantInfo",
              },
            },
            { $unwind: "$variantInfo" },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$orderInfo.user", "$$reviewerId"] },
                    { $eq: ["$orderInfo.status", "PAID"] },
                    {
                      $eq: [
                        "$variantInfo.product",
                        new mongoose.Types.ObjectId(productId),
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "verifiedPurchaseOrder",
        },
      },
      {
        $addFields: {
          verifiedPurchase: {
            $gt: [{ $size: "$verifiedPurchaseOrder" }, 0],
          },
        },
      },
      {
        $project: {
          verifiedPurchaseOrder: 0,
        },
      },
    ]);
    return reviews;
  }

  public static async updateReview(
    reviewId: string,
    updateData: ReviewUpdateDto,
    userId: string,
  ) {
    const review = await ReviewService.getReviewById(reviewId);

    if (review.user.toString() !== userId.toString()) {
      throw new AppError(403, "NOT_AUTHORIZED_TO_UPDATE_REVIEW");
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true },
    );
    return updatedReview;
  }

  public static async deleteReview(reviewId: string, userId: string) {
    const review = await ReviewService.getReviewById(reviewId);

    if (review.user.toString() !== userId) {
      throw new AppError(403, "NOT_AUTHORIZED_TO_DELETE_REVIEW");
    }

    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
    return deletedReview;
  }

  public static async getProductRatings(productId: string) {
    const ratings = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: "$product",
          "1": {
            $sum: {
              $cond: [{ $eq: ["$rating", 1] }, 1, 0],
            },
          },
          "2": {
            $sum: {
              $cond: [{ $eq: ["$rating", 2] }, 1, 0],
            },
          },
          "3": {
            $sum: {
              $cond: [{ $eq: ["$rating", 3] }, 1, 0],
            },
          },
          "4": {
            $sum: {
              $cond: [{ $eq: ["$rating", 4] }, 1, 0],
            },
          },
          "5": {
            $sum: {
              $cond: [{ $eq: ["$rating", 5] }, 1, 0],
            },
          },
          totalRatings: { $sum: 1 },
          avgRatings: { $avg: "$rating" },
        },
      },
      {
        $project: {
          _id: 0,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          totalRatings: 1,
          avgRatings: { $round: ["$avgRatings", 1] },
        },
      },
    ]);
    return ratings;
  }
}
