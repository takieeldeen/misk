import { t } from 'i18next';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, Button, Divider, Popover, Typography } from '@mui/material';
import { GridActionsCellItem, type GridCellParams } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTime, fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeleteBrand, useActivateBrand, useDeactivateBrand } from 'src/actions/brand';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import NewEditForm from './new-edit-form';

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
      {params.row.status === 'ACTIVE'
        ? (t('brands.active') ?? t('common.unknown'))
        : (t('brands.inactive') ?? t('common.unknown'))}
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

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
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
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {i18n.language === 'ar' ? params.row.categoryAr : params.row.categoryEn}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellActions({ params }: ParamsProps) {
  const [isEditingBrand, setIsEditingBrand] = useState<boolean>(false);
  const { currentLang } = useTranslate();
  const isActive = params.row.status === 'ACTIVE';
  const confirmDeleteRow = useBoolean();
  const confirmToggleStatus = useBoolean();
  const popover = usePopover();

  const { mutate: deleteBrand } = useDeleteBrand();
  const { mutate: activateBrand } = useActivateBrand();
  const { mutate: deactivateBrand } = useDeactivateBrand();

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteBrand(id, {
        onSuccess: () => {
          toast.success(t('brands.delete_success'));
          popover.onClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('brands.delete_error'));
        },
      });
    },
    [deleteBrand, popover]
  );
  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const isCurrentlyActive = currentStatus === 'ACTIVE';
      const action = isCurrentlyActive ? deactivateBrand : activateBrand;

      action(id, {
        onSuccess: () => {
          toast.success(
            isCurrentlyActive ? t('brands.deactivate_success') : t('brands.activate_success')
          );
          popover.onClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('brands.status_error'));
        },
      });
    },
    [activateBrand, deactivateBrand, popover]
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
                    {t('brands.edit_brand')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('brands.edit_brand_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              setIsEditingBrand(true);
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
                    {t('brands.delete_brand')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'error.main', opacity: 0.8 }}>
                    {t('brands.delete_brand_desc')}
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
                    {isActive ? t('brands.deactivate_brand') : t('brands.activate_brand')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isActive ? 'warning.main' : 'success.main', opacity: 0.8 }}
                  >
                    {isActive ? t('brands.deactivate_brand_desc') : t('brands.activate_brand_desc')}
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
        title={t('brands.delete_brand_title', {
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
        cancelLabel={t('brands.cancel')}
        content={<>{t('brands.delete_brand_warning')}</>}
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
            {t('brands.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmToggleStatus.value}
        onClose={confirmToggleStatus.onFalse}
        title={
          params.row.status === 'ACTIVE'
            ? t('brands.deactivate_brand_title', {
                name: currentLang.value === 'ar' ? params.row?.nameAr : params.row?.nameEn,
              })
            : t('brands.activate_brand_title', {
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
        cancelLabel={t('brands.cancel')}
        content={
          <>
            {params?.row?.status === 'ACTIVE'
              ? t('brands.deactivate_brand_warning')
              : t('brands.activate_brand_warning')}
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
            {params?.row?.status === 'ACTIVE' ? t('brands.deactivate') : t('brands.activate')}
          </Button>
        }
      />
      <NewEditForm
        open={isEditingBrand}
        onClose={() => {
          setIsEditingBrand(false);
          popover.onClose();
        }}
        currentBrand={params.row}
      />
    </>
  );
}
