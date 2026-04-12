import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { uploadFile } from "../../utilities/utilis/supabase.js";
import { createCategoryCreationDto } from "./categories.dto.js";
import { CategoriesServices } from "./categories.services.js";

export const categoryCreationHandler = catchAsync(async (req, res, next) => {
  const categoryData = createCategoryCreationDto(req.body);
  if (req.file) {
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${categoryData.nameEn.split(" ").join("-").toLowerCase()}`,
      "MISK_BUCKET",
      "categories_images/",
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    categoryData.imageUrl = publicUrl;
  }

  const newCategory = await CategoriesServices.createCategory(categoryData);
  res.status(200).json({
    status: "success",
    content: newCategory,
  });
});

export const getOneCategoryHandler = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await CategoriesServices.getOneCategory(categoryId as any);
  res.status(200).json({
    status: "success",
    content: category,
  });
});

export const getPaginatedCategoriesHandler = catchAsync(
  async (req, res, next) => {
    const { page = 1, limit = 9, ...filters } = req.query;
    const locale = (req?.headers?.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("i18next="))
      ?.split("=")[1] || "en") as "ar" | "en";
    const categories = await CategoriesServices.getPaginatedCategories(
      Number(page),
      Number(limit),
      filters as Record<string, string>,
      locale,
    );
    const categoriesCount = await CategoriesServices.getCategoriesCount(
      filters as Record<string, string>,
    );
    res.status(200).json({
      status: "success",
      content: categories,
      page: Number(page),
      limit: Number(limit),
      total: categoriesCount,
      totalPages: Math.ceil(categoriesCount / Number(limit)),
      hasNextPage: Number(page) < Math.ceil(categoriesCount / Number(limit)),
      hasPrevPage: Number(page) > 1,
      isEmpty: categories.length === 0,
      canReset: Number(page) > 1 || Object.keys(filters).length > 0,
    });
  },
);

export const updateCategoryHandler = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const categoryData = createCategoryCreationDto(req.body);
  if (req.file) {
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${categoryData.nameEn.split(" ").join("-").toLowerCase()}`,
      "MISK_BUCKET",
      "categories_images/",
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    categoryData.imageUrl = publicUrl;
  }

  const updatedCategory = await CategoriesServices.updateCategory(
    categoryId as any,
    categoryData,
  );
  res.status(200).json({
    status: "success",
    content: updatedCategory,
  });
});

export const deleteCategoryHandler = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const deletedCategory = await CategoriesServices.deleteCategory(
    categoryId as any,
  );
  res.status(200).json({
    status: "success",
    content: deletedCategory,
  });
});

export const activateCategoryHandler = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const activatedCategory = await CategoriesServices.activateCategory(
    categoryId as any,
  );
  res.status(200).json({
    status: "success",
    content: activatedCategory,
  });
});

export const deactivateCategoryHandler = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const deactivatedCategory = await CategoriesServices.deactivateCategory(
    categoryId as any,
  );
  res.status(200).json({
    status: "success",
    content: deactivatedCategory,
  });
});

export const getCategoriesValueHelp = catchAsync(async (req, res, next) => {
  const categoriesNames = await CategoriesServices.getCategoriesNames();
  res.status(200).json({
    status: "success",
    content: categoriesNames,
  });
});
