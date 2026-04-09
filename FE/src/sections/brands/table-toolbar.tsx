'use client';

import type { SyntheticEvent } from 'react';
import type { IBrandTableFilters } from 'src/types/brand';
import type { AutocompleteChangeReason } from '@mui/material';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useEffect, useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { TextField, Autocomplete } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  {
    id: 1,
    nameAr: 'نشط',
    nameEn: 'Active',
    value: 'ACTIVE',
  },
  {
    id: 2,
    nameAr: 'غير نشط',
    nameEn: 'Inactive',
    value: 'INACTIVE',
  },
];

type Props = {
  filters: UseSetStateReturn<IBrandTableFilters & { page: number }>;
  options: {
    stocks: {
      value: string;
      label: string;
    }[];
    publishs: {
      value: string;
      label: string;
    }[];
  };
};

export function ProductTableToolbar({ filters, options }: Props) {
  const popover = usePopover();
  const { t, i18n } = useTranslate();
  const mdUp = useResponsive('up', 'md');
  const local = useSetState<IBrandTableFilters>({
    status: filters.state.status,
    name: filters.state.name,
  });

  const debouncedName = useDebounce(local.state.name, 500);

  const handleChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      local.setState({ name: event.target.value });
    },
    [local]
  );

  const handleFilterStatus = useCallback(
    (event: SyntheticEvent<Element, Event>, newValue: any[], reason: AutocompleteChangeReason) => {
      const newStatus = newValue.map((option) => option.value);
      local.setState({ status: newStatus });
      filters.setState({ status: newStatus, page: 1 });
    },
    [filters, local]
  );

  useEffect(() => {
    if (debouncedName !== filters.state.name) {
      filters.setState({ name: debouncedName, page: 1 });
    }
  }, [debouncedName, filters]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <TextField
          label={t('common.name')}
          id="product-filter-name-input-label"
          value={local.state.name}
          onChange={handleChangeName}
          autoFocus
        />
      </FormControl>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 300 } }}>
        <Autocomplete
          sx={{
            '.MuiFormControl-root': {
              width: mdUp ? '13rem' : '100%',
            },
          }}
          componentsProps={{
            popper: {
              sx: {
                width: '13rem',
              },
            },
          }}
          fullWidth
          multiple
          options={STATUS_OPTIONS}
          getOptionLabel={(option) => (i18n.language === 'ar' ? option.nameAr : option.nameEn)}
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          value={STATUS_OPTIONS.filter((option) => local.state.status.includes(option.value))}
          onChange={handleFilterStatus}
          renderInput={(params) => <TextField {...params} label={t('common.status')} placeholder={t('common.status')} />}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox key={option.id} size="small" disableRipple checked={selected} />
              {i18n.language === 'ar' ? option.nameAr : option.nameEn}
            </li>
          )}
        />
      </FormControl>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
