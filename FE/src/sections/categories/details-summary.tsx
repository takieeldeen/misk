import type { ICategoryItem } from 'src/types/category';

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
import { useDeleteCategory, useActivateCategory, useDeactivateCategory } from 'src/actions/category';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  category?: ICategoryItem;
  disableActions?: boolean;
};

export function DetailsSummary({ category, disableActions, ...other }: Props) {
  const { _id, nameAr, nameEn, createdAt, updatedAt, products, status, stock } = category || {};

  const router = useRouter();

  const { t } = useTranslate();

  const confirmToggle = useBoolean();
  const confirmDelete = useBoolean();

  const activateCategory = useActivateCategory();
  const deactivateCategory = useDeactivateCategory();
  const deleteCategory = useDeleteCategory();

  const handleToggleStatus = useCallback(async () => {
    if (!_id) return;
    try {
      if (status === 'ACTIVE') {
        await deactivateCategory.mutateAsync(_id);
      } else {
        await activateCategory.mutateAsync(_id);
      }
      confirmToggle.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [_id, status, activateCategory, deactivateCategory, confirmToggle]);

  const handleDelete = useCallback(async () => {
    if (!_id) return;
    try {
      await deleteCategory.mutateAsync(_id);
      confirmDelete.onFalse();
      router.push(paths.dashboard.categories.list);
    } catch (error) {
      console.error(error);
    }
  }, [_id, deleteCategory, router, confirmDelete]);

  const renderStatus = status && (
    <Label color={status === 'ACTIVE' ? 'success' : 'error'} sx={{ mb: 2 }}>
      {status === 'ACTIVE' ? t('categories.active') : t('categories.inactive')}
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
        disabled={disableActions || activateCategory.isPending || deactivateCategory.isPending}
      >
        {status === 'ACTIVE' ? t('categories.deactivate') : t('categories.activate')}
      </Button>

      <Button
        fullWidth
        size="large"
        color="error"
        variant="contained"
        onClick={confirmDelete.onTrue}
        disabled={disableActions || deleteCategory.isPending}
      >
        {t('categories.delete')}
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
            <Typography variant="subtitle2">{t('categories.products')}:</Typography>
            <Typography variant="body2">{products || 0}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{t('categories.stock')}:</Typography>
            <Typography variant="body2">{stock || 0}</Typography>
          </Stack>

          {createdAt && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="subtitle2">{t('categories.created_at')}:</Typography>
              <Typography variant="body2">{fDate(createdAt)}</Typography>
            </Stack>
          )}

          {updatedAt && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">{t('categories.updated_at')}:</Typography>
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
            ? t('categories.deactivate_category_title', { name: nameEn })
            : t('categories.activate_category_title', { name: nameEn })
        }
        content={
          status === 'ACTIVE'
            ? t('categories.deactivate_category_warning')
            : t('categories.activate_category_warning')
        }
        cancelLabel={t('categories.cancel')}
        action={
          <Button variant="contained" color="warning" onClick={handleToggleStatus}>
            {status === 'ACTIVE' ? t('categories.deactivate') : t('categories.activate')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={t('categories.delete_category_title', { name: nameEn })}
        content={t('categories.delete_category_warning')}
        cancelLabel={t('categories.cancel')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('categories.delete')}
          </Button>
        }
      />
    </>
  );
}
