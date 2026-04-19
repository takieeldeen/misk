import type { AxiosRequestConfig } from 'axios';
import type { IReviewItem } from 'src/types/review';
import type { APIDetailsResponse } from 'src/types/common';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { getFetcher } from './api';

// ----------------------------------------------------------------------

export type IProductRatings = {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  totalRatings: number;
  avgRatings: number;
};

export function useGetProductReviews(productId: string) {
  const URL: [string, AxiosRequestConfig] = [endpoints.product.reviews(productId), {}];
  const queryKey = ['product', 'reviews', productId];

  const query = useQuery<APIDetailsResponse<IReviewItem[]>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!productId,
  });

  return { ...query, queryKey };
}

export function useGetProductRatings(productId: string) {
  const URL: [string, AxiosRequestConfig] = [endpoints.product.ratings(productId), {}];
  const queryKey = ['product', 'ratings', productId];

  const query = useQuery<APIDetailsResponse<IProductRatings[]>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!productId,
  });

  return { ...query, queryKey };
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, reviewId }: { productId: string; reviewId: string }) => {
      const res = await axios.delete(endpoints.product.reviewDetails(productId, reviewId));
      return res.data;
    },
    onSuccess: (data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', 'reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', 'ratings', productId] });
    },
  });
}
