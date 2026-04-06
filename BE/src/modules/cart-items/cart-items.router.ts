import { Router } from "express";
import {
  addItemToCartHandler,
  removeItemFromCartHandler,
  updateItemQuantityHandler,
} from "./cart-items.controller.js";
import requireAuth from "../../utilities/middlware/auth.middleware.js";

const CartItemsRouter = Router();

CartItemsRouter.route("/")
  .post(requireAuth, addItemToCartHandler);

CartItemsRouter.route("/:itemId")
  .patch(requireAuth, updateItemQuantityHandler)
  .delete(requireAuth, removeItemFromCartHandler);

export default CartItemsRouter;
