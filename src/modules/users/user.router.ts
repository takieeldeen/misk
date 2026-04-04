import { Router } from "express";
import requireAuth, {
  requireAdmin,
} from "../../utilities/middlware/auth.middleware.js";
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

UserRouter.use(requireAuth, requireAdmin);
UserRouter.route("/").get(getPaginatedUsersHandler);

UserRouter.route("/:userId")
  .get(getOneUserHandler)
  .delete(deleteUserHandler)
  .patch(uploadUserPhoto, updateUserHandler);

UserRouter.route("/:userId/activate").patch(activateUserHandler);

UserRouter.route("/:userId/deactivate").patch(deactivateUserHandler);

export default UserRouter;
