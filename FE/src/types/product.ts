import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IProductFilters = {
  name: string;
  status: string[];
  category: string;
  brand: string;
  gender: string;
};

export type IProductTableFilters = {
  name: string;
  status: string[];
  category: string[];
  brand: string[];
  gender: string[];
};

export type IProductItem = {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: 'ACTIVE' | 'INACTIVE';
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  category?: {
    _id: string;
    nameAr: string;
    nameEn: string;
    imageUrl: string;
  };
  brand?: {
    _id: string;
    nameAr: string;
    nameEn: string;
    imageUrl: string;
  };
  images: string[];
  variants: {
    _id: string;
    sizeMl: number;
    status: 'ACTIVE' | 'INACTIVE';
    stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
    price: number;
    stock: number;
  }[];
  reviews: {
    count: number;
    avgRating: number;
  };
  createdAt: IDateValue;
  updatedAt: IDateValue;
};
