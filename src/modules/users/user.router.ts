import { Router } from "express";
import requireAuth from "../../utilities/middlware/auth.middleware.js";
import {
  activateUserHandler,
  deactivateUserHandler,
  deleteUserHandler,
  getOneUserHandler,
  getPaginatedUsersHandler,
  updateUserHandler,
} from "./user.controller.js";
import { uploadUserPhoto } from "../../utilities/utilis/multer.js";

const UserRouter = Router();

UserRouter.route("/").get(requireAuth, getPaginatedUsersHandler);

UserRouter.route("/:userId")
  .get(requireAuth, getOneUserHandler)
  .delete(requireAuth, deleteUserHandler)
  .patch(requireAuth, uploadUserPhoto, updateUserHandler);

UserRouter.route("/:userId/activate").patch(requireAuth, activateUserHandler);

UserRouter.route("/:userId/deactivate").patch(
  requireAuth,
  deactivateUserHandler
);
