import { Router } from "express";
import {
  activateBrandHandler,
  brandCreationHandler,
  deactivateBrandHandler,
  deleteBrandHandler,
  getBrandsValueHelp,
  getOneBrandHandler,
  getPaginatedBrandsHandler,
  updateBrandHandler,
} from "./brands.controller.js";
import { uploadUserPhoto } from "../../utilities/utilis/multer.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const BrandsRouter = Router();

BrandsRouter.route("/value-help").get(getBrandsValueHelp);

BrandsRouter.route("/")
  .post(requireAuth, uploadUserPhoto, brandCreationHandler)
  .get(requireAuth, getPaginatedBrandsHandler);

BrandsRouter.route("/:brandId")
  .get(requireAuth, getOneBrandHandler)
  .delete(requireAuth, deleteBrandHandler)
  .patch(requireAuth, uploadUserPhoto, updateBrandHandler);

BrandsRouter.route("/:brandId/activate").patch(
  requireAuth,
  activateBrandHandler,
);

BrandsRouter.route("/:brandId/deactivate").patch(
  requireAuth,
  deactivateBrandHandler,
);

export default BrandsRouter;
