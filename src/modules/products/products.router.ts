import { Router } from "express";
import {
  activateProductHandler,
  deactivateProductHandler,
  deleteProductHandler,
  getOneProductHandler,
  getPaginatedProductsHandler,
  productCreationHandler,
  updateProductHandler,
} from "./products.controller.js";
import { uploadProductImages } from "../../utilities/utilis/multer.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";
import ReviewRouter from "../reviews/reviews.router.js";
import { getProductRatings } from "../reviews/reviews.controller.js";

const ProductsRouter = Router();

ProductsRouter.use("/:productId/reviews", ReviewRouter);
ProductsRouter.use("/:productId/ratings", getProductRatings);

ProductsRouter.route("/")
  .post(requireAuth, uploadProductImages, productCreationHandler)
  .get(requireAuth, getPaginatedProductsHandler);

ProductsRouter.route("/:productId")
  .get(requireAuth, getOneProductHandler)
  .delete(requireAuth, deleteProductHandler)
  .patch(requireAuth, uploadProductImages, updateProductHandler);

ProductsRouter.route("/:productId/activate").patch(
  requireAuth,
  activateProductHandler,
);

ProductsRouter.route("/:productId/deactivate").patch(
  requireAuth,
  deactivateProductHandler,
);

export default ProductsRouter;
