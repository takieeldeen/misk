import { Router } from "express";
import {
  createReview,
  deleteReview,
  getProductRatings,
  getProductReviews,
  updateReview,
} from "./reviews.controller.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const ReviewRouter = Router({ mergeParams: true });

ReviewRouter.route("/").get(getProductReviews).post(requireAuth, createReview);
ReviewRouter.route("/:reviewId")
  .patch(requireAuth, updateReview)
  .delete(requireAuth, deleteReview);

export default ReviewRouter;
