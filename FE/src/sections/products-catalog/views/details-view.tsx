'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Tab, Tabs, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { varAlpha } from 'src/theme/styles';
import {
  useGetProduct,
  useDeleteProduct,
  useActivateProduct,
  useDeactivateProduct,
} from 'src/actions/product';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { DetailsSummary } from '../details-summary';
import { DetailsCarousel } from '../details-carousel';
import { ProductDetailsReview } from '../details-review';
import { ProductDetailsDescription } from '../details-description';

// import { ProductDetailsReview } from '../details-review';
// import { ProductDetailsSummary } from '../product-details-summary';
// import { ProductDetailsCarousel } from '../product-details-carousel';
// import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function ProductDetailsView() {
  //   const checkout = useCheckoutContext();
  const { productId } = useParams();
  const { data, error } = useGetProduct(productId as string);
  const product = data?.content;
  const tabs = useTabs('description');
  const { i18n, t } = useTranslate();
  const router = useRouter();

  const confirmDeactivate = useBoolean();
  const confirmDelete = useBoolean();

  const activateMutation = useActivateProduct();
  const deactivateMutation = useDeactivateProduct();
  const deleteMutation = useDeleteProduct();

  const handleToggleStatus = async () => {
    if (product?.status === 'ACTIVE') {
      confirmDeactivate.onTrue();
    } else {
      try {
        await activateMutation.mutateAsync(productId as string);
        toast.success(t('common.ACTIVATE_PRODUCT_SUCCESS'));
      } catch (err: any) {
        toast.error(t('common.ACTIVATE_PRODUCT_ERROR'));
      }
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateMutation.mutateAsync(productId as string);
      toast.success(t('common.DEACTIVATE_PRODUCT_SUCCESS'));
      confirmDeactivate.onFalse();
    } catch (err: any) {
      toast.error(t('common.DEACTIVATE_PRODUCT_ERROR'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(productId as string);
      toast.success(t('common.DELETE_PRODUCT_SUCCESS'));
      confirmDelete.onFalse();
      router.replace(paths.dashboard.products.root);
    } catch (err: any) {
      toast.error(t('common.DELETE_PRODUCT_ERROR'));
    }
  };
  const SUMMARY = useMemo(
    () => [
      {
        title: t('PRODUCTS.ORIGINAL_TITLE'),
        description: t('PRODUCTS.ORIGINAL_DESC'),
        icon: 'solar:verified-check-bold',
      },
      {
        title: t('PRODUCTS.14_DAYS_RETURN_TITLE'),
        description: t('PRODUCTS.14_DAYS_RETURN_DESC'),
        icon: 'solar:clock-circle-bold',
      },
      {
        title: t('PRODUCTS.PREMIUM_QUALITY_TITLE'),
        description: t('PRODUCTS.PREMIUM_QUALITY_DESC'),
        icon: 'solar:shield-check-bold',
      },
    ],
    [t]
  );
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      {/* <CartIcon totalItems={checkout.totalItems} /> */}
      <Stack direction={{ md: 'row', xs: 'column' }} justifyContent="space-between" mb={2}>
        <Button
          startIcon={
            <Iconify
              icon={
                i18n.language === 'ar' ? 'solar:arrow-right-outline' : 'solar:arrow-left-outline'
              }
            />
          }
          onClick={() => router.replace(paths.dashboard.products.root)}
        >
          {t('common.BACK_TO_PRODUCTS_LIST')}
        </Button>
        <Stack direction="row" spacing={2}>
          <Tooltip title={t('common.edit')}>
            <IconButton>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton onClick={confirmDelete.onTrue} color="error">
              <Iconify icon="solar:trash-bin-minimalistic-bold" />
            </IconButton>
          </Tooltip>
          <LoadingButton
            variant="contained"
            color={product?.status === 'ACTIVE' ? 'error' : 'success'}
            onClick={handleToggleStatus}
            loading={activateMutation.isPending || deactivateMutation.isPending}
            sx={{
              ...(product?.status === 'ACTIVE' && {
                bgcolor: 'oklch(50.5% 0.213 27.518)',
                '&:hover': { bgcolor: 'oklch(39.6% 0.141 25.723)' },
              }),
            }}
          >
            {product?.status === 'ACTIVE' ? t('common.deactivate') : t('common.activate')}
          </LoadingButton>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={confirmDeactivate.value}
        onClose={confirmDeactivate.onFalse}
        title={t('common.DEACTIVATE_PRODUCT_CONFIRM_TITLE')}
        content={t('common.DEACTIVATE_PRODUCT_CONFIRM_MESSAGE')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeactivate}
            loading={deactivateMutation.isPending}
            sx={{ bgcolor: '#FF3030', '&:hover': { bgcolor: '#B71D18' } }}
          >
            {t('common.deactivate')}
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={t('common.DELETE_PRODUCT_CONFIRM_TITLE')}
        content={t('common.DELETE_PRODUCT_CONFIRM_MESSAGE')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            sx={{ bgcolor: '#FF3030', '&:hover': { bgcolor: '#B71D18' } }}
          >
            {t('common.delete')}
          </LoadingButton>
        }
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <DetailsCarousel images={product?.images} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <DetailsSummary
              product={product}
              // items={checkout.items}
              // onAddCart={checkout.onAddToCart}
              // onGotoStep={checkout.onGotoStep}
              //   TODO
              disableActions
            />
          )}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'description', label: t('PRODUCTS.DESCRIPTION_TAB') },
            { value: 'reviews', label: t('PRODUCTS.REVIEWS_TAB') },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={MOCK_DESCRIPTION} />
        )}

        {tabs.value === 'reviews' && <ProductDetailsReview />}
      </Card>
    </Container>
  );
}

const MOCK_DESCRIPTION =
  '\n<h6>المواصفات</h6>\n<table>\n  <tbody>\n    <tr>\n      <td>الفئة</td>\n      <td>عطور</td>\n    </tr>\n    <tr>\n      <td>العلامة التجارية</td>\n      <td>ماركة عالمية</td>\n    </tr>\n    <tr>\n      <td>مدة الثبات</td>\n      <td>طويلة الأمد</td>\n    </tr>\n    <tr>\n      <td>الحجم</td>\n      <td>100 مل</td>\n    </tr>\n    <tr>\n      <td>بلد الشحن</td>\n      <td>الولايات المتحدة</td>\n    </tr>\n  </tbody>\n</table>\n\n<h6>تفاصيل المنتج</h6>\n<ul>\n  <li>\n    <p>عطر فاخر يمنحك إحساساً بالانتعاش والأناقة طوال اليوم</p>\n  </li>\n  <li>\n    <p>تصميم زجاجة أنيق وسهل الاستخدام</p>\n  </li>\n  <li>\n    <p>تركيبة آمنة ومناسبة للاستخدام اليومي</p>\n  </li>\n  <li>\n    <p>مزيج عطري مميز يجمع بين النفحات الزهرية والخشبية</p>\n  </li>\n  <li>\n    <p>مناسب للرجال والنساء</p>\n  </li>\n  <li>\n    <p>بلد المنشأ: فرنسا</p>\n  </li>\n</ul>\n<h6>المميزات</h6>\n<ul>\n  <li>\n    <p>تركيبة من زيوت عطرية فاخرة تمنح ثباتاً يدوم طويلاً</p>\n  </li>\n  <li>\n    <p>انتشار قوي يترك أثراً جذاباً يدوم لساعات</p>\n  </li>\n  <li>\n    <p>مناسب لجميع المناسبات اليومية والرسمية</p>\n  </li>\n  <li>\n    <p>عبوة أنيقة مثالية كهدية</p>\n  </li>\n</ul>\n<h6>التوصيل والاسترجاع</h6>\n<p>احصل على شحن مجاني عند الطلب بقيمة 200 دولار أو أكثر.</p>\n<ul>\n  <li>\n    <p>التوصيل العادي: خلال 4-5 أيام عمل</p>\n  </li>\n  <li>\n    <p>التوصيل السريع: خلال 2-4 أيام عمل</p>\n  </li>\n</ul>\n<p>يتم تجهيز وشحن الطلبات من الإثنين إلى الجمعة (باستثناء العطلات الرسمية)</p>\n';

// const MOCK_DESCRIPTION = '';
