import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { CartItemServices } from "../cart-items/cart-items.services.js";
import { CartServices } from "./cart.services.js";

export const getCartHandler = catchAsync(async (req, res, next) => {
  const userId = (req as any).user?._id;
  if (!userId) throw new AppError(401, "UNAUTHORIZED");

  const cart = await CartServices.getUserCart(userId);
  res.status(200).json({
    status: "success",
    content: cart,
  });
});

export const clearCartHandler = catchAsync(async (req, res, next) => {
  const userId = (req as any).user?._id;
  if (!userId) throw new AppError(401, "UNAUTHORIZED");

  await CartItemServices.clearCart(userId);
  res.status(200).json({
    status: "success",
    content: [],
  });
});
