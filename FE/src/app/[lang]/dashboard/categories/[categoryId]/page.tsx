import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchCategory } from 'src/actions/category';

import { CategoryDetailsView } from 'src/sections/categories/views/details-view';

async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { queryClient } = await prefetchCategory(params.categoryId);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryDetailsView />
      </Suspense>
    </HydrationBoundary>
  );
}

export default CategoryPage;
