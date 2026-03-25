import { Router } from "express";

import authRouter from "../modules/auth/auth.router.js";

const APIRouter = Router();

APIRouter.use("/api/v1/auth", authRouter);

export default APIRouter;
