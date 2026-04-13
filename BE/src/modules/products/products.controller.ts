import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { uploadFile } from "../../utilities/utilis/supabase.js";
import { createProductCreationDto } from "./products.dto.js";
import { ProductsServices } from "./products.services.js";

export const productCreationHandler = catchAsync(async (req, res, next) => {
  const productData = createProductCreationDto(req.body);

  if (req.files && Array.isArray(req.files)) {
    const uploadPromises = (req.files as any[]).map((file, index) =>
      uploadFile(
        file,
        `${productData.nameEn.trim().split(" ").join("-").toLowerCase()}-${Date.now()}-${index}`,
        "MISK_BUCKET",
        `products_images/${productData.nameEn.trim().split(" ").join("-").toLowerCase()}/`,
      ),
    );
    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults
      .filter((res) => !res.error)
      .map((res) => res.publicUrl as string);

    if (imageUrls.length === 0 && (req.files as any[]).length > 0)
      throw new AppError(500, "IMAGE_UPLOAD_FAILED");

    productData.images = imageUrls;
  }

  const newProduct = await ProductsServices.createProduct(productData);
  res.status(200).json({
    status: "success",
    content: newProduct,
  });
});

export const getOneProductHandler = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await ProductsServices.getOneProduct(productId as any);
  res.status(200).json({
    status: "success",
    content: product,
  });
});

export const getPaginatedProductsHandler = catchAsync(
  async (req, res, next) => {
    const { page = 1, limit = 9, ...filters } = req.query;
    const locale = (req?.headers?.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("i18next="))
      ?.split("=")[1] || "en") as "ar" | "en";
    const products = await ProductsServices.getPaginatedProducts(
      Number(page),
      Number(limit),
      filters as Record<string, string>,
      locale,
    );
    const productsCount = await ProductsServices.getProductsCount(
      filters as Record<string, string>,
    );
    res.status(200).json({
      content: products,
      page: Number(page),
      limit: Number(limit),
      total: productsCount,
      totalPages: Math.ceil(productsCount / Number(limit)),
      hasNextPage: Number(page) < Math.ceil(productsCount / Number(limit)),
      hasPrevPage: Number(page) > 1,
      isEmpty: products.length === 0,
      canReset: Number(page) > 1 || Object.keys(filters).length > 0,
    });
  },
);

export const updateProductHandler = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const productData = createProductCreationDto(req.body);

  if (
    req.files &&
    Array.isArray(req.files) &&
    (req.files as any[]).length > 0
  ) {
    const uploadPromises = (req.files as any[]).map((file, index) =>
      uploadFile(
        file,
        `${productData.nameEn.trim().split(" ").join("-").toLowerCase()}-${Date.now()}-${index}`,
        "MISK_BUCKET",
        `products_images/${productData.nameEn.trim().split(" ").join("-").toLowerCase()}/`,
      ),
    );
    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults
      .filter((res) => !res.error)
      .map((res) => res.publicUrl as string);

    if (imageUrls.length === 0 && (req.files as any[]).length > 0)
      throw new AppError(500, "IMAGE_UPLOAD_FAILED");

    productData.images = imageUrls;
  }

  const updatedProduct = await ProductsServices.updateProduct(
    productId as any,
    productData,
  );
  res.status(200).json({
    status: "success",
    content: updatedProduct,
  });
});

export const deleteProductHandler = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const deletedProduct = await ProductsServices.deleteProduct(productId as any);
  res.status(200).json({
    status: "success",
    content: deletedProduct,
  });
});

export const activateProductHandler = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const activatedProduct = await ProductsServices.activateProduct(
    productId as any,
  );
  res.status(200).json({
    status: "success",
    content: activatedProduct,
  });
});

export const deactivateProductHandler = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const deactivatedProduct = await ProductsServices.deactivateProduct(
    productId as any,
  );
  res.status(200).json({
    status: "success",
    content: deactivatedProduct,
  });
});
