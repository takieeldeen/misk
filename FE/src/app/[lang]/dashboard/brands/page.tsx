import type { Metadata } from 'next';

import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { prefetchBrands } from 'src/actions/brand';

import { loadSearchParams } from 'src/sections/brands/params';
import { ProductListView } from 'src/sections/brands/views/list-view';

export const metadata: Metadata = {
  title: 'Brands List | Dashboard',
  description: 'Brands Page',
};

async function BrandsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const params = await loadSearchParams(searchParams);
  const { queryClient } = await prefetchBrands(params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListView />
      </Suspense>
    </HydrationBoundary>
  );
}

export default BrandsPage;
