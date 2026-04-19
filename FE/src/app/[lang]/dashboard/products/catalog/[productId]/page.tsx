import type { IProductItem } from 'src/types/product';
import type { APIDetailsResponse } from 'src/types/common';

import React from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchProduct } from 'src/actions/product';

import { ProductDetailsView } from 'src/sections/products-catalog/views/details-view';

export async function generateMetadata({
  params,
}: {
  params: { productId: string; lang: 'ar' | 'en' };
}) {
  const query = await prefetchProduct(params.productId);
  const productDetails = (
    query.queryClient.getQueryData(query.queryKey) as APIDetailsResponse<IProductItem>
  )?.content;

  return {
    title: params.lang === 'ar' ? productDetails?.nameAr : productDetails?.nameEn,
    description:
      params.lang === 'ar'
        ? `تفاصيل المنتج ${productDetails?.nameAr}`
        : `Product Details - ${productDetails?.nameEn}`,
  };
}

async function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const { queryClient } = await prefetchProduct(params.productId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailsView />
    </HydrationBoundary>
  );
}

export default ProductDetailsPage;
