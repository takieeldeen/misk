import { Router } from "express";

import authRouter from "../modules/auth/auth.router.js";
import BrandsRouter from "../modules/brands/brands.router.js";

const APIRouter = Router();

APIRouter.use("/api/v1/auth", authRouter);
APIRouter.use("/api/v1/brands", BrandsRouter);

export default APIRouter;
