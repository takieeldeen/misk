import type { AxiosRequestConfig } from 'axios';
import type { IBrandItem } from 'src/types/brand';
import type { APIListResponse } from 'src/types/common';

import { useQueryStates } from 'nuqs';
import { useQuery, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { PAGINATION } from 'src/config/constants';

import { brandParams } from 'src/sections/brands/params';

import { getFetcher } from './api';

export const useBrandsParams = () => useQueryStates(brandParams);

export async function prefetchBrands({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = '',
  status = [],
  filters = {},
}: {
  page: number;
  pageSize: number;
  name: string;
  status: string[];
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

export function useGetBrands({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = '',
  status = [],
  filters = {},
}: {
  page: number;
  pageSize: number;
  name?: string;
  status?: string[];
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
