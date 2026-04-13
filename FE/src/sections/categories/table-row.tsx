import { t } from 'i18next';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import { alpha, Button, Divider, Popover, Typography } from '@mui/material';
import { GridActionsCellItem, type GridCellParams } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTime, fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import {
  useDeleteCategory,
  useActivateCategory,
  useDeactivateCategory,
} from 'src/actions/category';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import NewEditForm from 'src/sections/categories/new-edit-form';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellProductCount({ params }: ParamsProps) {
  return params.row.products;
}

export function RenderCellStockCount({ params }: ParamsProps) {
  return params.row.stock;
}

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.status === 'ACTIVE' && 'success') || 'warning'}>
      {params.row.status === 'ACTIVE' ? t('categories.active') : t('categories.inactive')}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.createdAt)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Stack>
  );
}

export function RenderCellProduct({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  const { i18n } = useTranslate();
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          flexShrink: 0,
          position: 'relative',
          bgcolor: 'background.neutral',
          borderRadius: 1.5,
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {params.row.imageUrl ? (
          <Image
            src={params.row.imageUrl}
            alt={params.row.nameEn}
            fill
            style={{
              padding: '8px',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
          />
        ) : (
          <Iconify
            icon="carbon:no-image"
            width={32}
            sx={{ color: 'text.disabled', opacity: 0.5 }}
          />
        )}
      </Box>

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {i18n.language === 'ar' ? params.row.nameAr : params.row.nameEn}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellActions({ params }: ParamsProps) {
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const { currentLang } = useTranslate();
  const isActive = params.row.status === 'ACTIVE';
  const confirmDeleteRow = useBoolean();
  const confirmToggleStatus = useBoolean();
  const popover = usePopover();

  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: activateCategory } = useActivateCategory();
  const { mutate: deactivateCategory } = useDeactivateCategory();

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteCategory(id, {
        onSuccess: () => {
          toast.success(t('categories.delete_success'));
          popover.onClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('categories.delete_error'));
        },
      });
    },
    [deleteCategory, popover]
  );
  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const isCurrentlyActive = currentStatus === 'ACTIVE';
      const action = isCurrentlyActive ? deactivateCategory : activateCategory;

      action(id, {
        onSuccess: () => {
          toast.success(
            isCurrentlyActive
              ? t('categories.deactivate_success')
              : t('categories.activate_success')
          );
          popover.onClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('categories.status_error'));
        },
      });
    },
    [activateCategory, deactivateCategory, popover]
  );

  return (
    <>
      <Button
        onClick={popover.onOpen}
        sx={{ p: 0, aspectRatio: 1, px: 0, height: '48px', minWidth: 'unset' }}
      >
        <Iconify icon="solar:menu-dots-bold" width={28} sx={{ color: 'text.secondary' }} />
      </Button>
      <Popover {...popover}>
        <Stack direction="column" alignItems="center" sx={{ py: 1, width: 1 }}>
          <GridActionsCellItem
            showInMenu
            sx={{ transition: 'all 0.3s ease', width: 1 }}
            icon={
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.text.secondary, 0.16),
                }}
              >
                <Iconify icon="solar:pen-bold" width={28} sx={{ color: 'text.secondary' }} />
              </Stack>
            }
            label={
              (
                <Stack spacing={0.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      ...(currentLang.value === 'ar' && { fontFamily: 'Cairo' }),
                    }}
                  >
                    {t('categories.edit_category')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('categories.edit_category_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              setIsEditingCategory(true);
              popover.onClose();
            }}
          />
          <Divider flexItem />
          <GridActionsCellItem
            showInMenu
            sx={{ transition: 'all 0.3s ease', width: 1 }}
            icon={
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                }}
              >
                <Iconify
                  icon="solar:trash-bin-trash-bold"
                  width={28}
                  sx={{ color: 'error.main' }}
                />
              </Stack>
            }
            label={
              (
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'error.main',
                      fontWeight: 600,
                      ...(currentLang.value === 'ar' && { fontFamily: 'Cairo' }),
                    }}
                  >
                    {t('categories.delete_category')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'error.main', opacity: 0.8 }}>
                    {t('categories.delete_category_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              confirmDeleteRow.onTrue();
            }}
          />
          <Divider flexItem />
          <GridActionsCellItem
            showInMenu
            sx={{ transition: 'all 0.3s ease', width: 1 }}
            icon={
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    alpha(isActive ? theme.palette.warning.main : theme.palette.success.main, 0.16),
                }}
              >
                <Iconify
                  width={28}
                  icon={isActive ? 'solar:close-circle-bold' : 'solar:check-circle-bold'}
                  sx={{ color: isActive ? 'warning.main' : 'success.main' }}
                />
              </Stack>
            }
            label={
              (
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isActive ? 'warning.main' : 'success.main',
                      fontWeight: 800,
                      ...(currentLang.value === 'ar' && { fontFamily: 'Cairo' }),
                    }}
                  >
                    {isActive
                      ? t('categories.deactivate_category')
                      : t('categories.activate_category')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isActive ? 'warning.main' : 'success.main', opacity: 0.8 }}
                  >
                    {isActive
                      ? t('categories.deactivate_category_desc')
                      : t('categories.activate_category_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              confirmToggleStatus.onTrue();
            }}
          />
        </Stack>
      </Popover>

      <ConfirmDialog
        open={confirmDeleteRow.value}
        onClose={confirmDeleteRow.onFalse}
        title={t('categories.delete_category_title', {
          name: currentLang.value === 'ar' ? params.row?.nameAr : params.row?.nameEn,
        })}
        icon={
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              mx: 'auto',
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={56} />
          </Stack>
        }
        cancelLabel={t('categories.cancel')}
        content={<>{t('categories.delete_category_warning')}</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (params.row) {
                handleDeleteRow(params.row._id);
                confirmDeleteRow.onFalse();
              }
            }}
          >
            {t('categories.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmToggleStatus.value}
        onClose={confirmToggleStatus.onFalse}
        title={
          params.row.status === 'ACTIVE'
            ? t('categories.deactivate_category_title', {
                name: currentLang.value === 'ar' ? params.row?.nameAr : params.row?.nameEn,
              })
            : t('categories.activate_category_title', {
                name: currentLang.value === 'ar' ? params.row?.nameAr : params.row?.nameEn,
              })
        }
        icon={
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: (theme) =>
                alpha(
                  params.row.status === 'ACTIVE'
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
                  0.08
                ),
              color: params.row.status === 'ACTIVE' ? 'warning.main' : 'success.main',
              mx: 'auto',
            }}
          >
            <Iconify
              icon={
                params.row.status === 'ACTIVE'
                  ? 'solar:close-circle-bold'
                  : 'solar:check-circle-bold'
              }
              width={56}
            />
          </Stack>
        }
        cancelLabel={t('categories.cancel')}
        content={
          <>
            {params?.row?.status === 'ACTIVE'
              ? t('categories.deactivate_category_warning')
              : t('categories.activate_category_warning')}
          </>
        }
        action={
          <Button
            variant="contained"
            color={params?.row?.status === 'ACTIVE' ? 'warning' : 'success'}
            onClick={() => {
              if (params?.row) {
                handleToggleStatus(params?.row._id, params?.row.status);
                confirmToggleStatus.onFalse();
              }
            }}
          >
            {params?.row?.status === 'ACTIVE'
              ? t('categories.deactivate')
              : t('categories.activate')}
          </Button>
        }
      />
      <NewEditForm
        open={isEditingCategory}
        onClose={() => {
          setIsEditingCategory(false);
          popover.onClose();
        }}
        currentCategory={params.row}
      />
    </>
  );
}
