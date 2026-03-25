import { Router } from "express";

import {
  activateAccount,
  loginHandler,
  registerHandler,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/activate", activateAccount);

export default authRouter;
