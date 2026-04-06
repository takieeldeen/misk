import { CreateProductVariant, ProductVariant } from "./variants.type.js";

export function createProductVariantDto(body: any): CreateProductVariant {
  return {
    product: body?.product?.trim(),
    sizeMl: Number(body?.sizeMl),
    price: Number(body?.price),
    stock: Number(body?.stock),
    sku: body?.sku?.trim(),
    status: body?.status || "ACTIVE",
  };
}

export function createUpdateProductVariantDto(body: any): Partial<CreateProductVariant> {
  const dto: any = {};
  if (body.product) dto.product = body.product.trim();
  if (body.sizeMl !== undefined) dto.sizeMl = Number(body.sizeMl);
  if (body.price !== undefined) dto.price = Number(body.price);
  if (body.stock !== undefined) dto.stock = Number(body.stock);
  if (body.sku) dto.sku = body.sku.trim();
  if (body.status) dto.status = body.status;
  return dto;
}
