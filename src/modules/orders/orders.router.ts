import { Router } from "express";
import requireAuth, {
  requireAdmin,
} from "../../utilities/middlware/auth.middleware.js";
import {
  cancelMyOrderHandler,
  cancelOrderHandler,
  checkoutHandler,
  getAllOrdersHandler,
  getMyOrderDetailsHandler,
  getMyOrdersHandler,
  getOneOrderHandler,
  updateOrderStatusHandler,
} from "./orders.controller.js";

const OrderRouter = Router();

// Admin routes
OrderRouter.route("/admin").get(requireAuth, requireAdmin, getAllOrdersHandler);
OrderRouter.route("/admin/:orderId").get(
  requireAuth,
  requireAdmin,
  getOneOrderHandler,
);
OrderRouter.route("/admin/:orderId/status").patch(
  requireAuth,
  requireAdmin,
  updateOrderStatusHandler,
);
OrderRouter.route("/admin/:orderId/cancel").post(
  requireAuth,
  requireAdmin,
  cancelOrderHandler,
);

// User routes
OrderRouter.route("/")
  .post(requireAuth, checkoutHandler)
  .get(requireAuth, getMyOrdersHandler);
OrderRouter.route("/:orderId").get(requireAuth, getMyOrderDetailsHandler);
OrderRouter.route("/:orderId/cancel").post(requireAuth, cancelMyOrderHandler);

export default OrderRouter;

