import { Router } from "express";
import {
  brandCreationHandler,
  getOneBrandHandler,
  getPaginatedBrandsHandler,
} from "./brands.controller.js";
import { uploadUserPhoto } from "../../utilities/utilis/multer.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const BrandsRouter = Router();

BrandsRouter.route("/")
  .post(requireAuth, uploadUserPhoto, brandCreationHandler)
  .get(requireAuth, getPaginatedBrandsHandler);

BrandsRouter.get("/:brandId", requireAuth, getOneBrandHandler);

export default BrandsRouter;
