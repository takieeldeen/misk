import catchAsync from "../../utilities/utilis/catchAsync.js";
import { ReviewService } from "./reviews.service.js";

export const createReview = catchAsync(async (req, res) => {
  const { comment = "", rating } = req.body ?? {};
  const user = req.user?._id!;
  const { productId: product } = req.params as { productId: string };
  const newReviewData = {
    user,
    product,
    comment,
    rating,
  };

  const review = await ReviewService.createReview(newReviewData);

  res.status(201).json({
    status: "success",
    content: review,
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params as { reviewId: string };
  const userId = req.user?._id as string;
  const updateData = req.body;

  const review = await ReviewService.updateReview(reviewId, updateData, userId);

  res.status(200).json({
    status: "success",
    content: review,
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params as { reviewId: string };
  const userId = req.user?._id as string;

  const deletedReview = await ReviewService.deleteReview(reviewId, userId);

  res.status(200).json({
    status: "success",
    content: deletedReview,
  });
});

export const getProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params as { productId: string };

  const reviews = await ReviewService.getProductReviews(productId);

  res.status(200).json({
    status: "success",
    content: reviews,
  });
});

export const getProductRatings = catchAsync(async (req, res) => {
  const { productId } = req.params as { productId: string };

  const ratings = await ReviewService.getProductRatings(productId);

  res.status(200).json({
    status: "success",
    content: ratings,
  });
});
