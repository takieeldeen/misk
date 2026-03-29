import { Router } from "express";

import authRouter from "../modules/auth/auth.router.js";
import BrandsRouter from "../modules/brands/brands.router.js";
import CategoriesRouter from "../modules/categories/categories.router.js";
import ProductsRouter from "../modules/products/products.router.js";
import VariantsRouter from "../modules/variants/variants.router.js";
import CartRouter from "../modules/cart/cart.router.js";
import CartItemsRouter from "../modules/cart-items/cart-items.router.js";

const APIRouter = Router();

APIRouter.use("/api/v1/auth", authRouter);
APIRouter.use("/api/v1/brands", BrandsRouter);
APIRouter.use("/api/v1/categories", CategoriesRouter);
APIRouter.use("/api/v1/products", ProductsRouter);
APIRouter.use("/api/v1/variants", VariantsRouter);
APIRouter.use("/api/v1/cart", CartRouter);
APIRouter.use("/api/v1/cart-items", CartItemsRouter);

export default APIRouter;
