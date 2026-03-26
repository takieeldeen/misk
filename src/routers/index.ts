import { Router } from "express";

import authRouter from "../modules/auth/auth.router.js";
import BrandsRouter from "../modules/brands/brands.router.js";
import CategoriesRouter from "../modules/categories/categories.router.js";

const APIRouter = Router();

APIRouter.use("/api/v1/auth", authRouter);
APIRouter.use("/api/v1/brands", BrandsRouter);
APIRouter.use("/api/v1/categories", CategoriesRouter);

export default APIRouter;
