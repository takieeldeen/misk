import { Router } from "express";
import { getCartHandler, deleteCartHandler } from "./cart.controller.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const CartRouter = Router();

CartRouter.route("/")
  .get(requireAuth, getCartHandler)
  .delete(requireAuth, deleteCartHandler);

export default CartRouter;
