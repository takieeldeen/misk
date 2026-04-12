import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type ICategoryFilters = {
  name: string;
  status: string[];
};

export type ICategoryTableFilters = {
  name: string;
  status: string[];
};

export type ICategoryItem = {
  _id: string;
  nameAr: string;
  nameEn: string;
  status: string;
  createdAt: IDateValue;
  updatedAt: IDateValue;
  stock: number;
  products: number;
  imageUrl: string;
};
