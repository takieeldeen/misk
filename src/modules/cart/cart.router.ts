import { Router } from "express";
import { getCartHandler, clearCartHandler } from "./cart.controller.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const CartRouter = Router();

CartRouter.route("/").get(requireAuth, getCartHandler);

CartRouter.post("/clear", requireAuth, clearCartHandler);
export default CartRouter;
