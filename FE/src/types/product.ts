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
  category: string;
  brand: string;
  gender: string;
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
  };
  brand?: {
    _id: string;
    nameAr: string;
    nameEn: string;
  };
  images: string[];
  createdAt: IDateValue;
  updatedAt: IDateValue;
};
