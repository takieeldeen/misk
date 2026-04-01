import catchAsync from "../../utilities/utilis/catchAsync.js";
import OrderItemModel from "../orderItems/orderItems.model.js";
import { OrdersServices } from "./orders.service.js";

export const checkoutHandler = catchAsync(async (req, res, next) => {
  const userId = req.user?._id!;
  const order = await OrdersServices.checkout(userId);
  res.status(200).json({
    status: "success",
    data: order,
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
