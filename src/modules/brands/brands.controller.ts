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
      "brands_logos/"
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
  const brands = await BrandsServices.getPaginatedBrands(
    Number(page),
    Number(limit),
    filters as Record<string, string>
  );
  const brandsCount = await BrandsServices.getBrandsCount(
    filters as Record<string, string>
  );
  res.status(200).json({
    status: "success",
    content: brands,
    page: Number(page),
    limit: Number(limit),
    total: brandsCount,
  });
});
