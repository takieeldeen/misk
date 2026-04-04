import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import OrderItemModel from "../orderItems/orderItems.model.js";
import { OrdersServices } from "./orders.service.js";
import { OrderType } from "./orders.types.js";

export const checkoutHandler = catchAsync(async (req, res, next) => {
  const userId = req.user?._id!;
  const { payment, redirectionUrl } = await OrdersServices.checkout(userId);
  res.status(200).json({
    status: "success",
    data: { payment, redirectionUrl },
  });
});

export const getMyOrderDetailsHandler = catchAsync(async (req, res, next) => {
  const order = await OrdersServices.getOneOrder(
    req.params.orderId as string,
    req.user?._id!,
  );
  if (!order) next(new AppError(404, "ORDER_NOT_FOUND"));
  const orderItems = await OrderItemModel.find({ order: order._id });
  res.status(200).json({
    status: "success",
    data: { ...((order as any)?._doc ?? {}), orderItems },
  });
});

export const getMyOrdersHandler = catchAsync(async (req, res, next) => {
  const currentUserId = req?.user?._id!;
  const { page = 1, limit = 9, ...rest } = req.query;
  const filters = { ...rest, user: currentUserId };
  const orders = await OrdersServices.getPaginatedOrders(
    Number(page),
    Number(limit),
    filters as Record<string, string>,
  );
  const ordersCount = await OrdersServices.getOrdersCount(
    filters as Record<string, string>,
  );
  res.status(200).json({
    status: "success",
    content: orders,
    page: Number(page),
    limit: Number(limit),
    total: ordersCount,
  });
});

// Admin Handlers

export const getAllOrdersHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 9, ...rest } = req.query;
  const orders = await OrdersServices.getPaginatedOrders(
    Number(page),
    Number(limit),
    rest as Record<string, string>,
  );
  const ordersCount = await OrdersServices.getOrdersCount(
    rest as Record<string, string>,
  );
  res.status(200).json({
    status: "success",
    content: orders,
    page: Number(page),
    limit: Number(limit),
    total: ordersCount,
  });
});

export const getOneOrderHandler = catchAsync(async (req, res, next) => {
  const orderItems = await OrderItemModel.find({ order: req.params.orderId });
  const order = await OrdersServices.getOneOrder(req.params.orderId as string);
  res.status(200).json({
    status: "success",
    data: { ...((order as any)?._doc ?? {}), orderItems },
  });
});

export const updateOrderStatusHandler = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId as string;
  const { status } = req.body as { status: OrderType["status"] };
  if (!status) return next(new AppError(400, "MISSING_PARAMETER_STATUS"));
  const order = await OrdersServices.updateOrderStatus(orderId, status);
  res.status(200).json({
    status: "success",
    content: order,
  });
});

export const cancelOrderHandler = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId as string;
  const order = await OrdersServices.updateOrderStatus(orderId, "CANCELED");
  res.status(200).json({
    status: "success",
    content: order,
  });
});

export const cancelMyOrderHandler = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId as string;
  const userId = req.user!._id as string;
  const order = await OrdersServices.cancelMyOrder(orderId, userId);
  res.status(200).json({
    status: "success",
    content: order,
  });
});
