import type { IBrandItem } from 'src/types/brand';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeleteBrand, useActivateBrand, useDeactivateBrand } from 'src/actions/brand';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  brand?: IBrandItem;
  disableActions?: boolean;
};

export function DetailsSummary({ brand, disableActions, ...other }: Props) {
  const { _id, nameAr, nameEn, createdAt, updatedAt, products, status, stock } = brand || {};

  const router = useRouter();

  const { t } = useTranslate();

  const confirmToggle = useBoolean();
  const confirmDelete = useBoolean();

  const activateBrand = useActivateBrand();
  const deactivateBrand = useDeactivateBrand();
  const deleteBrand = useDeleteBrand();

  const handleToggleStatus = useCallback(async () => {
    if (!_id) return;
    try {
      if (status === 'ACTIVE') {
        await deactivateBrand.mutateAsync(_id);
      } else {
        await activateBrand.mutateAsync(_id);
      }
      confirmToggle.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [_id, status, activateBrand, deactivateBrand, confirmToggle]);

  const handleDelete = useCallback(async () => {
    if (!_id) return;
    try {
      await deleteBrand.mutateAsync(_id);
      confirmDelete.onFalse();
      router.push(paths.dashboard.brand.list);
    } catch (error) {
      console.error(error);
    }
  }, [_id, deleteBrand, router, confirmDelete]);

  const renderStatus = status && (
    <Label color={status === 'ACTIVE' ? 'success' : 'error'} sx={{ mb: 2 }}>
      {status === 'ACTIVE' ? t('brands.active') : t('brands.inactive')}
    </Label>
  );

  const renderActions = (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <Button
        fullWidth
        size="large"
        color={status === 'ACTIVE' ? 'warning' : 'success'}
        variant="contained"
        onClick={confirmToggle.onTrue}
        disabled={disableActions || activateBrand.isPending || deactivateBrand.isPending}
      >
        {status === 'ACTIVE' ? t('brands.deactivate') : t('brands.activate')}
      </Button>

      <Button
        fullWidth
        size="large"
        color="error"
        variant="contained"
        onClick={confirmDelete.onTrue}
        disabled={disableActions || deleteBrand.isPending}
      >
        {t('brands.delete')}
      </Button>
    </Stack>
  );

  return (
    <>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderStatus}

          <Typography variant="h5">{nameEn}</Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            {nameAr}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <Typography variant="subtitle2">{t('brands.products')}:</Typography>
            <Typography variant="body2">{products || 0}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{t('brands.stock')}:</Typography>
            <Typography variant="body2">{stock || 0}</Typography>
          </Stack>

          {createdAt && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="subtitle2">{t('brands.created_at')}:</Typography>
              <Typography variant="body2">{fDate(createdAt)}</Typography>
            </Stack>
          )}

          {updatedAt && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">{t('brands.updated_at')}:</Typography>
              <Typography variant="body2">{fDate(updatedAt)}</Typography>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}
      </Stack>

      <ConfirmDialog
        open={confirmToggle.value}
        onClose={confirmToggle.onFalse}
        title={
          status === 'ACTIVE'
            ? t('brands.deactivate_brand_title', { name: nameEn })
            : t('brands.activate_brand_title', { name: nameEn })
        }
        content={
          status === 'ACTIVE'
            ? t('brands.deactivate_brand_warning')
            : t('brands.activate_brand_warning')
        }
        cancelLabel={t('brands.cancel')}
        action={
          <Button variant="contained" color="warning" onClick={handleToggleStatus}>
            {status === 'ACTIVE' ? t('brands.deactivate') : t('brands.activate')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={t('brands.delete_brand_title', { name: nameEn })}
        content={t('brands.delete_brand_warning')}
        cancelLabel={t('brands.cancel')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('brands.delete')}
          </Button>
        }
      />
    </>
  );
}
