import {
  ProductCreationDto,
  ProductInfoDto,
  ProductType,
} from "./products.types.js";

export function createProductCreationDto(body: any): ProductCreationDto {
  return {
    nameAr: body?.nameAr?.trim(),
    nameEn: body?.nameEn?.trim(),
    descriptionAr: body?.descriptionAr?.trim(),
    descriptionEn: body?.descriptionEn?.trim(),
    gender: body?.gender || "NEUTRAL",
    category: body?.category,
    brand: body?.brand,
    content: body?.content,
  };
}

export function createProductInfoDto(product: ProductType): ProductInfoDto {
  const productObj =
    (product as any).toObject instanceof Function
      ? (product as any).toObject()
      : product;

  const { createdAt, updatedAt, ...productInfo } = productObj;

  return productInfo;
}
