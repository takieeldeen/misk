import { BrandType } from "../brands/brands.type.js";
import { CategoryType } from "../categories/categories.type.js";

export interface ProductType {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: "ACTIVE" | "INACTIVE";
  gender: "MALE" | "FEMALE" | "NEUTRAL";
  category?: string | CategoryType;
  brand?: string | BrandType;
  images?: string[];
  createdAt: Date;
  content?: string;

  updatedAt: Date;
}

export interface ProductCreationDto {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  gender: "MALE" | "FEMALE" | "NEUTRAL";
  category?: string;
  brand?: string;
  content?: string;
  images?: string[];
}

export interface ProductInfoDto {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: "ACTIVE" | "INACTIVE";
  gender: "MALE" | "FEMALE" | "NEUTRAL";
  category?: CategoryType;
  brand?: BrandType;
  images?: string[];
}
