// import type { IProductReview } from 'src/types/product';

import { useParams } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import { Box, Divider, Typography, LinearProgress } from '@mui/material';

// import { useBoolean } from 'src/hooks/use-boolean';

import { Fragment } from 'react';

// import { sumBy } from 'src/utils/helper';
import { fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { useGetProductReviews, useGetProductRatings } from 'src/actions/review';

import { ProductReviewItem } from './review-item';

// import { Iconify } from 'src/components/iconify';

// import { ProductReviewList } from './product-review-list';
// import { ProductReviewNewForm } from './product-review-new-form';

// ----------------------------------------------------------------------

export function ProductDetailsReview() {
  const params = useParams();
  const productId = typeof params.productId === 'string' ? params.productId : '';

  const { t, i18n } = useTranslate();
  const isRtl = i18n.language === 'ar';
  const { data: reviewsData } = useGetProductReviews(productId);
  const { data: ratingsData } = useGetProductRatings(productId);

  const reviews = reviewsData?.content || [];
  const ratings = ratingsData?.content?.[0] || {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    totalRatings: 0,
    avgRatings: 0,
  };

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 5 }}>
      <Typography variant="subtitle2">{t('PRODUCTS.AVERAGE_RATING')}</Typography>
      <Typography variant="h2">
        {ratings.avgRatings}
        /5
      </Typography>

      <Rating readOnly value={ratings.avgRatings} precision={0.1} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t('PRODUCTS.REVIEWS', { count: fShortenNumber(ratings.totalRatings) })}
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) =>
          isRtl ? { md: `dashed 1px ${theme.vars.palette.divider}` } : 'none',
        borderRight: (theme) =>
          !isRtl ? { md: `dashed 1px ${theme.vars.palette.divider}` } : 'none',
      }}
    >
      {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating) => (
        <Stack key={rating} direction="row" alignItems="center">
          <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
            {rating}
          </Typography>

          <LinearProgress
            color="inherit"
            variant="determinate"
            value={((ratings as any)[rating] / ratings.totalRatings) * 100}
            sx={{ mx: 2, flexGrow: 1 }}
          />

          <Typography
            variant="body2"
            component="span"
            sx={{ minWidth: 48, color: 'text.secondary' }}
          >
            {fShortenNumber((ratings as any)[rating])}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        sx={{ py: { xs: 5, md: 0 } }}
      >
        {renderSummary}
        {renderProgress}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box>
        {reviews.map((review, i) => (
          <Fragment key={review._id}>
            <ProductReviewItem review={review} />
            {i !== reviews.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
          </Fragment>
        ))}
      </Box>

      {/* <ProductReviewList reviews={reviews} />

      <ProductReviewNewForm open={review.value} onClose={review.onFalse} /> */}
    </>
  );
}
