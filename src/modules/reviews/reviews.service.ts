import ReviewModel from "./reviews.model.js";
import { ReviewCreationDto, ReviewUpdateDto } from "./reviews.types.js";
import { AppError } from "../../utilities/utilis/error.js";

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
    const reviews = await ReviewModel.find({ product: productId }).sort({
      createdAt: -1,
    });
    return reviews;
  }

  public static async updateReview(
    reviewId: string,
    updateData: ReviewUpdateDto,
    userId: string,
  ) {
    const review = await ReviewService.getReviewById(reviewId);

    if (review.user.toString() !== userId) {
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
}
