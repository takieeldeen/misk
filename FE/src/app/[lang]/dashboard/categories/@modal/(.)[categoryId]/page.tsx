import type { ICategoryItem } from 'src/types/category';
import type { APIDetailsResponse } from 'src/types/common';

import React from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchCategory } from 'src/actions/category';

import DetailsDrawer from 'src/components/details-drawer/details-drawer';

import { CategoryDetailsView } from 'src/sections/categories/views/details-view';

export async function generateMetadata({
  params,
}: {
  params: { categoryId: string; lang: 'ar' | 'en' };
}) {
  const query = await prefetchCategory(params.categoryId);
  const categoryDetails = (
    query.queryClient.getQueryData(query.queryKey) as APIDetailsResponse<ICategoryItem>
  )?.content;
  return {
    title: params.lang === 'ar' ? categoryDetails?.nameAr : categoryDetails?.nameEn,
    description:
      params.lang === 'ar'
        ? `تفاصيل الفئة ${categoryDetails?.nameAr}`
        : `Category Details - ${categoryDetails?.nameEn}`,
  };
}

async function CategoryModalPage({ params }: { params: { categoryId: string; lang: 'ar' | 'en' } }) {
  const { queryClient } = await prefetchCategory(params.categoryId);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailsDrawer backLink="/dashboard/categories" open>
        <CategoryDetailsView />
      </DetailsDrawer>
    </HydrationBoundary>
  );
}

export default CategoryModalPage;
