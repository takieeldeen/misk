import type { IBrandItem } from 'src/types/brand';
import type { APIDetailsResponse } from 'src/types/common';

import React from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchBrand } from 'src/actions/brand';

import DetailsDrawer from 'src/components/details-drawer/details-drawer';

import { BrandDetailsView } from 'src/sections/brands/views/details-view';

export async function generateMetadata({
  params,
}: {
  params: { brandId: string; lang: 'ar' | 'en' };
}) {
  const query = await prefetchBrand(params.brandId);
  const brandDetails = (
    query.queryClient.getQueryData(query.queryKey) as APIDetailsResponse<IBrandItem>
  )?.content;
  return {
    title: params.lang === 'ar' ? brandDetails?.nameAr : brandDetails?.nameEn,
    description:
      params.lang === 'ar'
        ? `تفاصيل العلامة التجارية ${brandDetails?.nameAr}`
        : `Brand Details - ${brandDetails?.nameEn}`,
  };
}

async function BrandModalPage({ params }: { params: { brandId: string; lang: 'ar' | 'en' } }) {
  const { queryClient } = await prefetchBrand(params.brandId);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailsDrawer backLink="/dashboard/brands" open>
        <BrandDetailsView />
      </DetailsDrawer>
    </HydrationBoundary>
  );
}

export default BrandModalPage;
