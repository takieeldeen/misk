'use client';

import { useParams } from 'next/navigation';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { useGetCategory } from 'src/actions/category';

import { Iconify } from 'src/components/iconify';

import { SkeletonView } from './skeleton-view';
import { DetailsSummary } from '../details-summary';
import { ProductDetailsCarousel } from '../details-carousel';

// ----------------------------------------------------------------------

export function CategoryDetailsView() {
  const { categoryId } = useParams();
  const { data, isLoading } = useGetCategory(categoryId as string);
  const category = data?.content;
  const { t, i18n } = useTranslate();

  if (isLoading) return <SkeletonView />;
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Button
        component={RouterLink}
        href={paths.dashboard.categories.list}
        startIcon={
          <Iconify
            icon={i18n.language === 'ar' ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
            width={16}
          />
        }
        sx={{ mb: 3 }}
      >
        {t('categories.return_to_list')}
      </Button>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={category?.imageUrl ? [category?.imageUrl] : []} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {category && <DetailsSummary category={category} disableActions={!category?.status} />}
        </Grid>
      </Grid>

      <Card sx={{ mt: 5 }}>
        {/* Additional category details can go here */}
      </Card>
    </Container>
  );
}
