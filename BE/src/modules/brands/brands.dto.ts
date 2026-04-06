import { BrandCreationDto, BrandInfoDto, BrandType } from "./brands.type.js";

export function createBrandCreationDto(body: any): BrandCreationDto {
  return {
    nameAr: body?.nameAr?.trim(),
    nameEn: body?.nameEn?.trim(),
  };
}

export function createBrandInfoDto(brand: BrandType): BrandInfoDto {
  const brandObj =
    (brand as any).toObject instanceof Function
      ? (brand as any).toObject()
      : brand;

  const { createdAt, updatedAt, ...brandInfo } = brandObj;

  return brandInfo;
}
