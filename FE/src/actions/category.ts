import type { AxiosRequestConfig } from 'axios';
import type { ICategoryItem } from 'src/types/category';
import type { APIListResponse, APIDetailsResponse } from 'src/types/common';

import { cache } from 'react';
import { useQueryStates } from 'nuqs';
import { useQuery, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { PAGINATION } from 'src/config/constants';

import { categoryParams } from 'src/sections/categories/params';

import { getFetcher } from './api';

export const useCategoriesParams = () => useQueryStates(categoryParams);

export const prefetchCategories = cache(
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
      endpoints.category.list,
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
    const queryKey = ['category', 'list', URL];
    const queryClient = new QueryClient();
    const query = await queryClient.prefetchQuery<APIListResponse<ICategoryItem>>({
      queryKey,
      queryFn: getFetcher(URL),
    });
    return { queryClient, query, queryKey };
  }
);

export const prefetchCategory = cache(async (id: string) => {
  const URL: [string, AxiosRequestConfig] = [endpoints.category.details(id), {}];
  const queryKey = ['category', 'details', id];
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<ICategoryItem>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query, queryKey };
});

export function useGetCategories({
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
    endpoints.category.list,
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
  const queryKey = ['category', 'list', URL];
  const query = useQuery<APIListResponse<ICategoryItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { ...query, queryKey };
}

export function useGetCategory(id: string) {
  const URL: [string, AxiosRequestConfig] = [endpoints.category.details(id), {}];
  const queryKey = ['category', 'details', id];
  const query = useQuery<APIDetailsResponse<ICategoryItem>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!id,
  });
  return { ...query, queryKey };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);

      if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }
      const res = await axios.post(endpoints.category.list, formData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const formData = new FormData();
      formData.append('nameAr', data.nameAr);
      formData.append('nameEn', data.nameEn);

      if (data.imageUrl && data.imageUrl instanceof File) {
        formData.append('imageUrl', data.imageUrl);
      }
      
      const res = await axios.patch(endpoints.category.details(id), formData);
      return res;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['category', 'details', variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${endpoints.category.list}/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
    },
  });
}

export function useDeleteManyCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await axios.post(endpoints.category.deleteMany, { ids });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
    },
  });
}

export function useActivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.category.activate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['category', 'details', id] });
    },
  });
}

export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(endpoints.category.deactivate(id));
      return res;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['category', 'details', id] });
    },
  });
}
