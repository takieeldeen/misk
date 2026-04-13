import React from 'react';
import Image from 'next/image';

import Link from '@mui/material/Link';
import { GridActionsCellItem, type GridCellParams } from '@mui/x-data-grid';

import {
  Box,
  alpha,
  Stack,
  Button,
  Divider,
  Popover,
  Typography,
  ListItemText,
} from '@mui/material';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellProduct({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  const { i18n } = useTranslate();
  const imageUrl = params.row.images?.[0];

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
        {imageUrl ? (
          <Image
            src={imageUrl}
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
          <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
            {params.row._id}
          </Typography>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellStatus({ params }: ParamsProps) {
  const { t } = useTranslate();
  return (
    <Label variant="soft" color={(params.row.status === 'ACTIVE' && 'success') || 'warning'}>
      {params.row.status === 'ACTIVE' ? t('brands.active') : t('brands.inactive')}
    </Label>
  );
}

export function RenderCellCategory({ params }: ParamsProps) {
  const { i18n } = useTranslate();
  const { category } = params.row;
  if (!category) return null;

  return (
    <Typography variant="body2" noWrap>
      {i18n.language === 'ar' ? category.nameAr : category.nameEn}
    </Typography>
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

export function RenderCellQuantity({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{params.row.quantity}</Box>
    </Stack>
  );
}

export function RenderCellPrice({ params }: ParamsProps) {
  if (params.row.minPrice === 0 && params.row.maxPrice === 0) return <Box component="span">--</Box>;
  return (
    <Stack spacing={0.5}>
      <Box component="span">
        {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(
          params.row.minPrice
        )}{' '}
        -{' '}
        {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(
          params.row.maxPrice
        )}
      </Box>
    </Stack>
  );
}

export function RenderCellBrand({ params }: ParamsProps) {
  const { i18n, t } = useTranslate();
  const { brand } = params.row;

  return (
    <Typography variant="body2" noWrap>
      {i18n.language === 'ar'
        ? (brand?.nameAr ?? t('common.unknown'))
        : (brand?.nameEn ?? t('common.unknown'))}
    </Typography>
  );
}

export function RenderCellGender({ params }: ParamsProps) {
  const { t } = useTranslate();
  const { gender } = params.row;
  const genderColor: Record<string, string> = {
    MALE: '#14b8a6',
    FEMALE: '#ec4899',
    NEUTRAL: '#f59e0b',
  };

  const genderIcon: Record<string, string> = {
    MALE: 'mdi:gender-male',
    FEMALE: 'ph:gender-female-bold',
    NEUTRAL: 'bi:gender-ambiguous',
  };
  return (
    // <Label variant="soft" color={genderColor[gender]}>
    //   {t(`common.${gender.toLowerCase()}`)}
    // </Label>
    <Box
      sx={{
        px: 2,
        borderRadius: 999,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        bgcolor: genderColor[gender],
        color: 'black',
        minWidth: 100,
      }}
    >
      <Iconify icon={genderIcon[gender]} width={20} />
      <Typography sx={{ fontSize: 12, textTransform: 'capitalize', fontWeight: 700 }}>
        {t(`common.${gender.toLowerCase()}`)}
      </Typography>
    </Box>
  );
}

export function RenderCellActions({
  params,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onToggleStatus,
}: ParamsProps & {
  onViewRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
  onToggleStatus: () => void;
}) {
  const { t, currentLang } = useTranslate();
  const popover = usePopover();
  const isActive = params.row.status === 'ACTIVE';

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
                <Iconify icon="solar:eye-bold" width={28} sx={{ color: 'text.secondary' }} />
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
                    {t('common.view')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('common.view_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              onViewRow();
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
                    {t('common.edit')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('common.edit_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              onEditRow();
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
                <Stack spacing={0.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'error.main',
                      fontWeight: 600,
                      ...(currentLang.value === 'ar' && { fontFamily: 'Cairo' }),
                    }}
                  >
                    {t('common.delete')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'error.main', opacity: 0.8 }}>
                    {t('common.delete_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              onDeleteRow();
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
                <Stack spacing={0.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isActive ? 'warning.main' : 'success.main',
                      fontWeight: 800,
                      ...(currentLang.value === 'ar' && { fontFamily: 'Cairo' }),
                    }}
                  >
                    {isActive ? t('common.deactivate') : t('common.activate')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isActive ? 'warning.main' : 'success.main', opacity: 0.8 }}
                  >
                    {isActive ? t('common.deactivate_desc') : t('common.activate_desc')}
                  </Typography>
                </Stack>
              ) as any
            }
            onClick={() => {
              onToggleStatus();
              popover.onClose();
            }}
          />
        </Stack>
      </Popover>
    </>
  );
}

