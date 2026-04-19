import type { IReviewItem } from 'src/types/review';

import { useParams } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Badge, Button, Tooltip, Divider, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeleteReview } from 'src/actions/review';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  review: IReviewItem;
};

export function ProductReviewItem({ review }: Props) {
  const { t, i18n } = useTranslate();

  const confirm = useBoolean();
  const params = useParams();
  const productId = typeof params.productId === 'string' ? params.productId : '';

  const { mutate: deleteReview } = useDeleteReview();

  const handleDelete = async () => {
    deleteReview(
      { productId, reviewId: review._id },
      {
        onSuccess: () => {
          toast.success(t('PRODUCTS.DELETE_REVIEW_SUCCESS'));
          confirm.onFalse();
        },
        onError: (error) => {
          toast.error(t('PRODUCTS.DELETE_REVIEW_ERROR'));
          console.error(error);
        },
      }
    );
  };

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      // direction={{ xs: 'row', md: 'column' }}
      direction={{ xs: 'row', md: 'row' }}
      sx={{ textAlign: { md: 'center' } }}
    >
      <Avatar
        src={review?.user?.imageUrl}
        sx={{ width: { xs: 36, md: 48 }, height: { xs: 36, md: 48 } }}
      />

      <Stack sx={{ alignItems: 'flex-start' }}>
        <Stack direction={{ md: 'row' }} spacing={2}>
          <Typography variant="subtitle2">{review?.user?.name}</Typography>
          {review.verifiedPurchase && (
            <>
              <Divider orientation="vertical" flexItem />
              <Badge
                sx={{
                  bgcolor: 'success.dark',
                  color: 'success.contrastText',
                  borderRadius: 10,
                  width: 'fit-content',
                  p: 0.5,
                  px: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: '100%' }}
                  gap={0.5}
                >
                  <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
                  <Typography sx={{ fontSize: 12 }}>{t('PRODUCTS.VERIFIED_PURCHASE')}</Typography>
                </Stack>
              </Badge>
            </>
          )}
        </Stack>
        <Typography variant="caption">{fDate(review.createdAt)}</Typography>
      </Stack>
    </Stack>
  );

  const renderContent = (
    <Stack spacing={0} flexGrow={1}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 2 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Rating size="small" value={review.rating} precision={0.1} readOnly />

        <Tooltip title={t('PRODUCTS.DELETE_REVIEW')}>
          <IconButton
            onClick={confirm.onTrue}
            sx={{
              ml: i18n.language === 'ar' ? 'auto' : 2,
              mr: i18n.language === 'ar' ? 2 : 'auto',
            }}
          >
            <Iconify icon="tabler:trash" width={16} color="error.main" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2">{review.comment}</Typography>
    </Stack>
  );

  return (
    <>
      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'column' }}
        sx={{ px: { xs: 2.5, md: 3 } }}
        py={{ xs: 2, md: 2 }}
      >
        {renderInfo}

        {renderContent}
      </Stack>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('PRODUCTS.DELETE_REVIEW_TITLE')}
        content={t('PRODUCTS.DELETE_REVIEW_DESC')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('common.delete')}
          </Button>
        }
      />
    </>
  );
}
