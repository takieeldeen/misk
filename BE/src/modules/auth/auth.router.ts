import { Router } from "express";

import requireAuth from "../../utilities/middlware/auth.middleware.js";
import { uploadUserPhoto } from "../../utilities/utilis/multer.js";
import {
  activateAccount,
  changePasswordHandler,
  forgetPasswordHandler,
  getMeHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
  resetPasswordHandler,
  updateMeHandler,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/activate", activateAccount);
authRouter.get("/me", getMeHandler);
authRouter.patch("/update-me", requireAuth, uploadUserPhoto, updateMeHandler);
authRouter.post("/forgot-password", forgetPasswordHandler);
authRouter.post("/reset-password", resetPasswordHandler);
authRouter.post("/change-password", requireAuth, changePasswordHandler);

export default authRouter;
