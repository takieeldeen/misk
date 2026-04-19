import { ProductType } from "../products/products.types.js";
import { UserType } from "../users/user.types.js";

export interface ReviewType {
  _id: string;
  user: string | UserType;
  product: string | ProductType;
  rating: number;
  comment?: string;
  verifiedPurchase?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreationDto {
  user: string;
  product: string;
  rating: number;
  comment?: string;
}

export interface ReviewInfoDto {
  _id: string;
  user: string;
  product: string;
  rating: number;
  comment?: string;
}

export interface ReviewUpdateDto {
  rating?: number;
  comment?: string;
}
