import type { AxiosRequestConfig } from 'axios';
import type { IBrandItem } from 'src/types/brand';
import type { APIListResponse, APIDetailsResponse } from 'src/types/common';

import { cache } from 'react';
import { useQueryStates } from 'nuqs';
import { useQuery, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { PAGINATION } from 'src/config/constants';

import { brandParams } from 'src/sections/brands/params';

import { getFetcher } from './api';

export const useBrandsParams = () => useQueryStates(brandParams);

export const prefetchBrands = cache(
  async ({
    page = PAGINATION.DEFAULT_PAGE,
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    name = '',
    status = [],
    sort = '',
    filters = {},
  }: {
    page: number;
    pageSize: number;
    name: string;
    status: string[];
    sort?: string;
    filters?: Record<string, string | number>;
  }) => {
    const URL: [string, AxiosRequestConfig] = [
      endpoints.brand.list,
      {
        params: {
          page,
          size: pageSize,
          name,
          status: status.join(','),
          sort,
          ...filters,
        },
      },
    ];
    const queryKey = ['brand', 'list', URL];
    const queryClient = new QueryClient();
    const query = await queryClient.prefetchQuery<APIListResponse<IBrandItem>>({
      queryKey,
      queryFn: getFetcher(URL),
    });
    return { queryClient, query, queryKey };
  }
);

export const prefetchBrand = cache(async (id: string) => {
  const URL: [string, AxiosRequestConfig] = [endpoints.brand.details(id), {}];
  const queryKey = ['brand', 'details', id];
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<IBrandItem>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query, queryKey };
});

export function useGetBrands({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = '',
  status = [],
  sort = '',
  filters = {},
}: {
  page: number;
  pageSize: number;
  name?: string;
  status?: string[];
  sort?: string;
  filters?: Record<string, string | number>;
}) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.brand.list,
    {
      params: {
        page,
        size: pageSize,
        name,
        status: status.join(','),
        sort,
        ...filters,
      },
    },
  ];
  const queryKey = ['brand', 'list', URL];
  const query = useQuery<APIListResponse<IBrandItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { ...query, queryKey };
}

export function useGetBrand(id: string) {
  const URL: [string, AxiosRequestConfig] = [endpoints.brand.details(id), {}];
  const queryKey = ['brand', 'details', id];
  const query = useQuery<APIDetailsResponse<IBrandItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!id,
  });
  return { ...query, queryKey };
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);

      if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }
      const res = await axios.post(endpoints.brand.list, formData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);

      if (data.imageUrl && data.imageUrl instanceof File) {
        formData.append('imageUrl', data.imageUrl);
      }
      
      const res = await axios.patch(endpoints.brand.details(id), formData);
      return res;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'details', variables.id] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${endpoints.brand.list}/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
    },
  });
}
export function useDeleteManyBrands() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await axios.post(endpoints.brand.deleteMany, { ids });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
    },
  });
}
export function useActivateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.brand.activate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'details', id] });
    },
  });
}

export function useDeactivateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.brand.deactivate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'details', id] });
    },
  });
}
