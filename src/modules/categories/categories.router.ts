import { Router } from "express";
import {
  activateCategoryHandler,
  categoryCreationHandler,
  deactivateCategoryHandler,
  deleteCategoryHandler,
  getCategoriesValueHelp,
  getOneCategoryHandler,
  getPaginatedCategoriesHandler,
  updateCategoryHandler,
} from "./categories.controller.js";
import { uploadUserPhoto } from "../../utilities/utilis/multer.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const CategoriesRouter = Router();

CategoriesRouter.route("/value-help").get(getCategoriesValueHelp);

CategoriesRouter.route("/")
  .post(requireAuth, uploadUserPhoto, categoryCreationHandler)
  .get(getPaginatedCategoriesHandler);

CategoriesRouter.route("/:categoryId")
  .get(getOneCategoryHandler)
  .delete(requireAuth, deleteCategoryHandler)
  .patch(requireAuth, uploadUserPhoto, updateCategoryHandler);

CategoriesRouter.route("/:categoryId/activate").patch(
  requireAuth,
  activateCategoryHandler,
);

CategoriesRouter.route("/:categoryId/deactivate").patch(
  requireAuth,
  deactivateCategoryHandler,
);

export default CategoriesRouter;
