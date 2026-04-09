import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IBrandFilters = {
  name: string;
  status: string[];
};

export type IBrandTableFilters = {
  name: string;
  status: string[];
};

export type IBrandItem = {
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
