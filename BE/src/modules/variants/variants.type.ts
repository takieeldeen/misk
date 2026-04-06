import { ProductType } from "../products/products.types.js";

export interface ProductVariant {
  _id: string;
  product: string | ProductType;
  sizeMl: number;
  price: number;
  stock: number;
  sku: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductVariant {
  product: string;
  sizeMl: number;
  price: number;
  stock: number;
  sku: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateProductVariant {
  _id: string;
  product?: string;
  sizeMl?: number;
  price?: number;
  stock?: number;
  sku?: string;
  status?: "ACTIVE" | "INACTIVE";
}
