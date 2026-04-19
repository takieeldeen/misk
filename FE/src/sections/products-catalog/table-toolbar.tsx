'use client';

import type { SyntheticEvent } from 'react';
import type { IProductTableFilters } from 'src/types/product';
import type { AutocompleteChangeReason } from '@mui/material';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useEffect, useCallback } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';
import { useGetBrands } from 'src/actions/brand';
import { useGetCategories } from 'src/actions/category';

import { Iconify } from 'src/components/iconify';

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

const GENDER_OPTIONS = [
  { id: 1, nameAr: 'ذكوري', nameEn: 'For Men', value: 'MALE' },
  { id: 2, nameAr: 'انثوي', nameEn: 'For Women', value: 'FEMALE' },
  { id: 3, nameAr: 'محايد', nameEn: 'Unisex', value: 'NEUTRAL' },
];

type Props = {
  filters: UseSetStateReturn<IProductTableFilters & { page: number }>;
};

export function ProductTableToolbar({ filters }: Props) {
  const { t, i18n } = useTranslate();
  const mdUp = useResponsive('up', 'md');
  const { data: categoriesData } = useGetCategories({ page: 1, pageSize: 100 });
  const { data: brandsData } = useGetBrands({ page: 1, pageSize: 100 });

  const categories = categoriesData?.content || [];
  const brands = brandsData?.content || [];

  const local = useSetState<IProductTableFilters>({
    status: filters.state.status,
    name: filters.state.name,
    gender: filters.state.gender,
    category: filters.state.category,
    brand: filters.state.brand,
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

  const handleFilterGender = useCallback(
    (event: SyntheticEvent<Element, Event>, newValue: any[]) => {
      const newGender = newValue.map((option) => option.value);
      local.setState({ gender: newGender });
      filters.setState({ gender: newGender, page: 1 });
    },
    [filters, local]
  );

  const handleFilterCategory = useCallback(
    (event: SyntheticEvent<Element, Event>, newValue: any[]) => {
      const newCategory = newValue.map((option) => option._id);
      local.setState({ category: newCategory });
      filters.setState({ category: newCategory, page: 1 });
    },
    [filters, local]
  );

  const handleFilterBrand = useCallback(
    (event: SyntheticEvent<Element, Event>, newValue: any[]) => {
      const newBrand = newValue.map((option) => option._id);
      local.setState({ brand: newBrand });
      filters.setState({ brand: newBrand, page: 1 });
    },
    [filters, local]
  );

  useEffect(() => {
    if (debouncedName !== filters.state.name) {
      filters.setState({ name: debouncedName, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    if (filters.state.name !== local.state.name) {
      local.setState({ name: filters.state.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state.name]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 300 } }}>
        <TextField
          label={t('common.name')}
          placeholder={t('common.search')}
          value={local.state.name}
          onChange={handleChangeName}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <Autocomplete
          multiple
          options={STATUS_OPTIONS}
          getOptionLabel={(option) => (i18n.language === 'ar' ? option.nameAr : option.nameEn)}
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          value={STATUS_OPTIONS.filter((option) => local.state.status.includes(option.value))}
          onChange={handleFilterStatus}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('categories.status')}
              placeholder={t('categories.status')}
              sx={{ minWidth: '100%', flex: 1 }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox size="small" disableRipple checked={selected} />
              {i18n.language === 'ar' ? option.nameAr : option.nameEn}
            </li>
          )}
        />
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <Autocomplete
          multiple
          options={GENDER_OPTIONS}
          getOptionLabel={(option) => (i18n.language === 'ar' ? option.nameAr : option.nameEn)}
          value={GENDER_OPTIONS.filter((option) => local.state.gender.includes(option.value))}
          onChange={handleFilterGender}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('common.gender')}
              placeholder={t('common.gender')}
              sx={{ minWidth: '100%', flex: 1 }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox size="small" disableRipple checked={selected} />
              {i18n.language === 'ar' ? option.nameAr : option.nameEn}
            </li>
          )}
        />
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <Autocomplete
          multiple
          options={categories}
          getOptionLabel={(option: any) => (i18n.language === 'ar' ? option.nameAr : option.nameEn)}
          value={categories.filter((option: any) => local.state.category.includes(option._id))}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={handleFilterCategory}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('common.category')}
              placeholder={t('common.category')}
              sx={{ minWidth: '100%', flex: 1 }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox size="small" disableRipple checked={selected} />
              {i18n.language === 'ar' ? option.nameAr : option.nameEn}
            </li>
          )}
        />
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <Autocomplete
          multiple
          options={brands}
          getOptionLabel={(option: any) => (i18n.language === 'ar' ? option.nameAr : option.nameEn)}
          value={brands.filter((option: any) => local.state.brand.includes(option._id))}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={handleFilterBrand}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('common.brand')}
              placeholder={t('common.brand')}
              sx={{ minWidth: '100%', flex: 1 }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox size="small" disableRipple checked={selected} />
              {i18n.language === 'ar' ? option.nameAr : option.nameEn}
            </li>
          )}
        />
      </FormControl>
    </>
  );
}
