import { Router } from "express";
import {
  activateVariantHandler,
  deactivateVariantHandler,
  deleteVariantHandler,
  getOneVariantHandler,
  getPaginatedVariantsHandler,
  updateVariantHandler,
  variantCreationHandler,
} from "./variants.controller.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const VariantsRouter = Router();

VariantsRouter.route("/")
  .post(requireAuth, variantCreationHandler)
  .get(requireAuth, getPaginatedVariantsHandler);

VariantsRouter.route("/:variantId")
  .get(requireAuth, getOneVariantHandler)
  .delete(requireAuth, deleteVariantHandler)
  .patch(requireAuth, updateVariantHandler);

VariantsRouter.route("/:variantId/activate").patch(
  requireAuth,
  activateVariantHandler,
);

VariantsRouter.route("/:variantId/deactivate").patch(
  requireAuth,
  deactivateVariantHandler,
);

export default VariantsRouter;
