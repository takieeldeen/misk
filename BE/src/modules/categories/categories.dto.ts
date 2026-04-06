import { CategoryCreationDto, CategoryInfoDto, CategoryType } from "./categories.type.js";

export function createCategoryCreationDto(body: any): CategoryCreationDto {
  return {
    nameAr: body?.nameAr?.trim(),
    nameEn: body?.nameEn?.trim(),
  };
}

export function createCategoryInfoDto(category: CategoryType): CategoryInfoDto {
  const categoryObj =
    (category as any).toObject instanceof Function
      ? (category as any).toObject()
      : category;

  const { createdAt, updatedAt, ...categoryInfo } = categoryObj;

  return categoryInfo;
}
