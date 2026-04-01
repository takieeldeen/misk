import { Router } from "express";
import requireAuth from "../../utilities/middlware/auth.middleware.js";
import { checkoutHandler, getOneOrderHandler } from "./orders.controller.js";

const OrderRouter = Router();

OrderRouter.route("/").post(requireAuth, checkoutHandler);
OrderRouter.route("/:orderId").get(requireAuth, getOneOrderHandler);

export default OrderRouter;
