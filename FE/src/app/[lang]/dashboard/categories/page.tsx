import type { Metadata } from 'next';

import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchCategories } from 'src/actions/category';

import { loadSearchParams } from 'src/sections/categories/params';
import { CategoryListView } from 'src/sections/categories/views/list-view';

export const metadata: Metadata = {
  title: 'Categories List | Dashboard',
  description: 'Categories Page',
};

async function CategoriesPage({ searchParams }: { searchParams: Record<string, string> }) {
  const params = await loadSearchParams(searchParams);
  const { queryClient } = await prefetchCategories(params);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryListView />
      </Suspense>
    </HydrationBoundary>
  );
}

export default CategoriesPage;
