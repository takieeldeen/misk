import type { GridCellParams } from '@mui/x-data-grid';

import React from 'react';
import Image from 'next/image';

import Link from '@mui/material/Link';
import {
  Box,
  Stack,
  MenuItem,
  MenuList,
  Typography,
  IconButton,
  ListItemText,
} from '@mui/material';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

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
  const { t } = useTranslate();
  const popover = usePopover();

  return (
    <>
      <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            {t('common.view')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t('common.edit')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onToggleStatus();
              popover.onClose();
            }}
            sx={{ color: params.row.status === 'ACTIVE' ? 'warning.main' : 'success.main' }}
          >
            <Iconify
              icon={
                params.row.status === 'ACTIVE'
                  ? 'solar:close-circle-bold'
                  : 'solar:check-circle-bold'
              }
            />
            {params.row.status === 'ACTIVE' ? t('common.deactivate') : t('common.activate')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDeleteRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('common.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
