import { Router } from "express";

import authRouter from "../modules/auth/auth.router.js";
import BrandsRouter from "../modules/brands/brands.router.js";
import CategoriesRouter from "../modules/categories/categories.router.js";
import ProductsRouter from "../modules/products/products.router.js";
import VariantsRouter from "../modules/variants/variants.router.js";
import CartRouter from "../modules/cart/cart.router.js";
import CartItemsRouter from "../modules/cart-items/cart-items.router.js";
import OrderRouter from "../modules/orders/orders.router.js";
import PaymentRouter from "../modules/payments/payment.router.js";
import CitiesRouter from "../modules/cities/cities.router.js";
import UsersRouter from "../modules/users/user.router.js";
import InsightsRouter from "../modules/insights/insights.router.js";

const APIRouter = Router();

APIRouter.use("/api/v1/auth", authRouter);
APIRouter.use("/api/v1/brands", BrandsRouter);
APIRouter.use("/api/v1/categories", CategoriesRouter);
APIRouter.use("/api/v1/products", ProductsRouter);
APIRouter.use("/api/v1/variants", VariantsRouter);
APIRouter.use("/api/v1/cart", CartRouter);
APIRouter.use("/api/v1/cart-items", CartItemsRouter);
APIRouter.use("/api/v1/orders", OrderRouter);
APIRouter.use("/api/v1/payments", PaymentRouter);
APIRouter.use("/api/v1/cities", CitiesRouter);
APIRouter.use("/api/v1/admin/users", UsersRouter);
APIRouter.use("/api/v1/admin/insights", InsightsRouter);
export default APIRouter;
