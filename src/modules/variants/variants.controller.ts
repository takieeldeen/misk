import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { createProductVariantDto, createUpdateProductVariantDto } from "./variants.dto.js";
import { VariantServices } from "./variants.services.js";

export const variantCreationHandler = catchAsync(async (req, res, next) => {
  const variantData = createProductVariantDto(req.body);
  const newVariant = await VariantServices.createVariant(variantData);
  res.status(200).json({
    status: "success",
    content: newVariant,
  });
});

export const getOneVariantHandler = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;
  const variant = await VariantServices.getOneVariant(variantId as any);
  res.status(200).json({
    status: "success",
    content: variant,
  });
});

export const getPaginatedVariantsHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 9, ...filters } = req.query;
  const variants = await VariantServices.getPaginatedVariants(
    Number(page),
    Number(limit),
    filters as Record<string, string>,
  );
  const variantsCount = await VariantServices.getVariantsCount(
    filters as Record<string, string>,
  );
  res.status(200).json({
    status: "success",
    content: variants,
    page: Number(page),
    limit: Number(limit),
    total: variantsCount,
  });
});

export const updateVariantHandler = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;
  const variantData = createUpdateProductVariantDto(req.body);
  const updatedVariant = await VariantServices.updateVariant(
    variantId as any,
    variantData,
  );
  res.status(200).json({
    status: "success",
    content: updatedVariant,
  });
});

export const deleteVariantHandler = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;
  const deletedVariant = await VariantServices.deleteVariant(variantId as any);
  res.status(200).json({
    status: "success",
    content: deletedVariant,
  });
});

export const activateVariantHandler = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;
  const activatedVariant = await VariantServices.activateVariant(variantId as any);
  res.status(200).json({
    status: "success",
    content: activatedVariant,
  });
});

export const deactivateVariantHandler = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;
  const deactivatedVariant = await VariantServices.deactivateVariant(variantId as any);
  res.status(200).json({
    status: "success",
    content: deactivatedVariant,
  });
});
