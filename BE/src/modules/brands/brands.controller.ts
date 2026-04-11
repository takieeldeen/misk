import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { uploadFile } from "../../utilities/utilis/supabase.js";
import { createBrandCreationDto } from "./brands.dto.js";
import { BrandsServices } from "./brands.services.js";

export const brandCreationHandler = catchAsync(async (req, res, next) => {
  const brandData = createBrandCreationDto(req.body);
  if (req.file) {
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${brandData.nameEn.split(" ").join("-").toLowerCase()}`,
      "MISK_BUCKET",
      "brands_logos/",
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    brandData.imageUrl = publicUrl;
  }

  const newBrand = await BrandsServices.createBrand(brandData);
  res.status(200).json({
    status: "success",
    content: newBrand,
  });
});

export const getOneBrandHandler = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await BrandsServices.getOneBrand(brandId as any);
  res.status(200).json({
    status: "success",
    content: brand,
  });
});

export const getPaginatedBrandsHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 9, ...filters } = req.query;
  const locale = (req?.headers?.cookie
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("i18next="))
    ?.split("=")[1] || "en") as "ar" | "en";
  const brands = await BrandsServices.getPaginatedBrands(
    Number(page),
    Number(limit),
    filters as Record<string, string>,
    locale,
  );
  const brandsCount = await BrandsServices.getBrandsCount(
    filters as Record<string, string>,
  );
  res.status(200).json({
    status: "success",
    content: brands,
    page: Number(page),
    limit: Number(limit),
    total: brandsCount,
    totalPages: Math.ceil(brandsCount / Number(limit)),
    hasNextPage: Number(page) < Math.ceil(brandsCount / Number(limit)),
    hasPrevPage: Number(page) > 1,
    isEmpty: brands.length === 0,
    canReset: Number(page) > 1 || Object.keys(filters).length > 0,
  });
});

export const updateBrandHandler = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const brandData = createBrandCreationDto(req.body);
  if (req.file) {
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${brandData.nameEn.split(" ").join("-").toLowerCase()}`,
      "MISK_BUCKET",
      "brands_logos/",
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    brandData.imageUrl = publicUrl;
  }

  const updatedBrand = await BrandsServices.updateBrand(
    brandId as any,
    brandData,
  );
  res.status(200).json({
    status: "success",
    content: updatedBrand,
  });
});

export const deleteBrandHandler = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const deletedBrand = await BrandsServices.deleteBrand(brandId as any);
  res.status(200).json({
    status: "success",
    content: deletedBrand,
  });
});

export const deleteManyBrandsHandler = catchAsync(async (req, res, next) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    throw new AppError(400, "IDS_ARRAY_REQUIRED");
  }

  await BrandsServices.deleteManyBrands(ids);

  res.status(200).json({
    status: "success",
    message: "Brands deleted successfully",
  });
});

export const activateBrandHandler = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const activatedBrand = await BrandsServices.activateBrand(brandId as any);
  res.status(200).json({
    status: "success",
    content: activatedBrand,
  });
});

export const deactivateBrandHandler = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const deactivatedBrand = await BrandsServices.deactivateBrand(brandId as any);
  res.status(200).json({
    status: "success",
    content: deactivatedBrand,
  });
});

export const getBrandsValueHelp = catchAsync(async (req, res, next) => {
  const brandsNames = await BrandsServices.getBrandsNames();
  res.status(200).json({
    status: "success",
    content: brandsNames,
  });
});
