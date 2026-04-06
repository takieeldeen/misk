import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { CartItemServices } from "./cart-items.services.js";

export const addItemToCartHandler = catchAsync(async (req, res, next) => {
  const userId = (req as any).user?._id;
  if (!userId) throw new AppError(401, "UNAUTHORIZED");

  const { variantId, quantity = 1 } = req.body;
  if (!variantId) throw new AppError(400, "VARIANT_ID_REQUIRED");

  const item = await CartItemServices.addItemToCart(userId, {
    variantId,
    quantity: Number(quantity),
  });

  res.status(200).json({
    status: "success",
    content: item,
  });
});

export const updateItemQuantityHandler = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) throw new AppError(400, "QUANTITY_REQUIRED");

  const item = await CartItemServices.updateItemQuantity(itemId as any, Number(quantity));

  res.status(200).json({
    status: "success",
    content: item,
  });
});

export const removeItemFromCartHandler = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  const item = await CartItemServices.removeItemFromCart(itemId as any);

  res.status(200).json({
    status: "success",
    content: item,
  });
});
