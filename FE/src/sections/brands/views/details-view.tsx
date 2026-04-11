'use client';

import { useParams } from 'next/navigation';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetBrand } from 'src/actions/brand';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function BrandDetailsView() {
  const params = useParams();
  const { brandId } = params;
  const { t, currentLang } = useTranslate();

  const { data: brand, isLoading, error } = useGetBrand(brandId as string);

  if (isLoading) return <Typography sx={{ p: 5 }}>Loading...</Typography>;
  if (error || !brand) return <Typography sx={{ p: 5 }}>Error loading brand details</Typography>;

  const localizedName = currentLang.value === 'ar' ? brand.nameAr : brand.nameEn;

  return (
    <Scrollbar sx={{ p: 3, height: 1 }}>
      <Stack spacing={3}>
        <Typography variant="h4">{t('brands.brand_details') || 'Brand Details'}</Typography>

        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Image
                alt={localizedName}
                src={brand.imageUrl}
                ratio="1/1"
                sx={{ borderRadius: 1.5, bgcolor: 'background.neutral' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h5">{localizedName}</Typography>
                  <Label color={brand.status === 'ACTIVE' ? 'success' : 'error'}>
                    {brand.status}
                  </Label>
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                  <DetailItem label={t('brands.name_en')} value={brand.nameEn} />
                  <DetailItem label={t('brands.name_ar')} value={brand.nameAr} />
                  <DetailItem label={t('brands.products')} value={brand.products} />
                  <DetailItem label={t('brands.stock')} value={brand.stock} />
                  <DetailItem label={t('brands.created_at')} value={fDateTime(brand.createdAt)} />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Scrollbar>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Stack>
  );
}
