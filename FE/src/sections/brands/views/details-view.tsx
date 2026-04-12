'use client';

import { useParams } from 'next/navigation';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { useGetBrand } from 'src/actions/brand';

import { Iconify } from 'src/components/iconify';

import { SkeletonView } from './skeleton-view';
import { DetailsSummary } from '../details-summary';
import { ProductDetailsCarousel } from '../details-carousel';

// ----------------------------------------------------------------------

export function BrandDetailsView() {
  const { brandId } = useParams();
  const { data, isLoading } = useGetBrand(brandId as string);
  const brand = data?.content;
  const { t, i18n } = useTranslate();

  if (isLoading) return <SkeletonView />;
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Button
        component={RouterLink}
        href={paths.dashboard.brand.list}
        startIcon={
          <Iconify
            icon={i18n.language === 'ar' ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
            width={16}
          />
        }
        sx={{ mb: 3 }}
      >
        {t('brands.return_to_list')}
      </Button>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={brand?.imageUrl ? [brand?.imageUrl] : []} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {brand && <DetailsSummary brand={brand} disableActions={!brand?.status} />}
        </Grid>
      </Grid>

      <Card>
        {/* {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings}
            reviews={product?.reviews}
            totalRatings={product?.totalRatings}
            totalReviews={product?.totalReviews}
          />
        )} */}
      </Card>
    </Container>
  );
}
