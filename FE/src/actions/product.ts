import type { AxiosRequestConfig } from 'axios';
import type { IProductItem } from 'src/types/product';
import type { APIListResponse, APIDetailsResponse } from 'src/types/common';

import { cache } from 'react';
import { useQueryStates } from 'nuqs';
import { useQuery, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { PAGINATION } from 'src/config/constants';

import { productParams } from 'src/sections/products-catalog/params';

import { getFetcher } from './api';

export const useProductsParams = () => useQueryStates(productParams);

export const prefetchProducts = cache(
  async ({
    page = PAGINATION.DEFAULT_PAGE,
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    name = '',
    status = [],
    category = '',
    brand = '',
    gender = '',
    sort = '',
    filters = {},
  }: {
    page: number;
    pageSize: number;
    name: string;
    status: string[];
    category?: string;
    brand?: string;
    gender?: string;
    sort?: string;
    filters?: Record<string, string | number>;
  }) => {
    const URL: [string, AxiosRequestConfig] = [
      endpoints.product.list,
      {
        params: {
          page,
          size: pageSize,
          name,
          status: status.join(','),
          category,
          brand,
          gender,
          sort,
          ...filters,
        },
      },
    ];
    const queryKey = ['product', 'list', URL];
    const queryClient = new QueryClient();
    const query = await queryClient.prefetchQuery<APIListResponse<IProductItem>>({
      queryKey,
      queryFn: getFetcher(URL),
    });
    return { queryClient, query, queryKey };
  }
);

export const prefetchProduct = cache(async (id: string) => {
  const URL: [string, AxiosRequestConfig] = [endpoints.product.details(id), {}];
  const queryKey = ['product', 'details', id];
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<IProductItem>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query, queryKey };
});

export function useGetProducts({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = '',
  status = [],
  category = '',
  brand = '',
  gender = '',
  sort = '',
  filters = {},
}: {
  page: number;
  pageSize: number;
  name?: string;
  status?: string[];
  category?: string;
  brand?: string;
  gender?: string;
  sort?: string;
  filters?: Record<string, string | number>;
}) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.product.list,
    {
      params: {
        page,
        size: pageSize,
        name,
        status: status.join(','),
        category,
        brand,
        gender,
        sort,
        ...filters,
      },
    },
  ];
  const queryKey = ['product', 'list', URL];
  const query = useQuery<APIListResponse<IProductItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { ...query, queryKey };
}

export function useGetProduct(id: string) {
  const URL: [string, AxiosRequestConfig] = [endpoints.product.details(id), {}];
  const queryKey = ['product', 'details', id];
  const query = useQuery<APIDetailsResponse<IProductItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!id,
  });
  return { ...query, queryKey };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);
      formData.append('descriptionAr', data.descriptionAr);
      formData.append('descriptionEn', data.descriptionEn);
      formData.append('gender', data.gender);
      formData.append('category', data.category);
      formData.append('brand', data.brand);

      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File) => {
          formData.append('images', image);
        });
      }

      const res = await axios.post(endpoints.product.list, formData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);
      formData.append('descriptionAr', data.descriptionAr);
      formData.append('descriptionEn', data.descriptionEn);
      formData.append('gender', data.gender);
      formData.append('category', data.category);
      formData.append('brand', data.brand);

      if (data.images && data.images.length > 0) {
        data.images.forEach((image: any) => {
          if (image instanceof File) {
            formData.append('images', image);
          } else {
            // If it's an existing image URL, we might need a different way to handle it
            // depending on how the backend expects updates.
            // For now, let's assume we send new files.
          }
        });
      }

      const res = await axios.patch(endpoints.product.details(id), formData);
      return res;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['product', 'details', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(endpoints.product.details(id));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
    },
  });
}

export function useActivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.product.activate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['product', 'details', id] });
    },
  });
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.product.deactivate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['product', 'details', id] });
    },
  });
}
