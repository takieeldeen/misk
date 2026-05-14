/* eslint-disable no-nested-ternary */
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { countries } from 'src/assets/data';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'country' | string;
  helperText?: React.ReactNode;
  fetchOnscroll?: Function;
  renderInput?: (params: any) => JSX.Element;
}

const selectAllOption = {
  id: 'SELECT_ALL',
  nameAr: 'اختيار الكل',
  nameEn: 'Select All',
};
export default function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  type,
  helperText,
  placeholder,
  fetchOnscroll,
  onChange,
  renderOption,
  ...other
}: Props<T, Multiple, DisableClearable, FreeSolo>) {
  const theme = useTheme();
  const { control, setValue } = useFormContext();
  const { multiple } = other;
  const { t, i18n } = useTranslate();
  // Fetch on Scroll Function Implementation
  const handleFetchOnScroll = useCallback(
    async (event: React.SyntheticEvent) => {
      const listboxNode = event?.currentTarget;

      if (
        listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
        fetchOnscroll
      ) {
        console.log('fetch on scroll');
        fetchOnscroll();
      }
    },
    [fetchOnscroll]
  );
  // Adjust height based on the multiple prop
  const textFieldSx = {
    '& .MuiOutlinedInput-root.MuiOutlinedInput-root': {
      height: multiple ? '48pxauto !important' : '48px !important', // Customize based on `multiple`
    },
  };
  // Function to filter options and exclude selected ones when multiple is true
  const filterOptions = (options: T[], { inputValue, getOptionLabel, selected }: any) => {
    const isOptionEqualToValue = other?.isOptionEqualToValue;
    const HAS_VALUE_EXTRACTION_FN = !!isOptionEqualToValue;
    const VALUE_EXTRACTION_FN = HAS_VALUE_EXTRACTION_FN
      ? isOptionEqualToValue
      : (option: any, val: any) => option === val;
    if (!multiple)
      return options.filter(
        // Filter the menu According to the input value
        (option) => {
          const OPTION_SELECTED = !!selected;
          const CURRENT_OPTION_LABEL = getOptionLabel(option)?.toLowerCase();
          const CURRENT_INPUT_VALUE = inputValue?.toLowerCase();
          if (!OPTION_SELECTED) return CURRENT_OPTION_LABEL?.includes(CURRENT_INPUT_VALUE);
          return (
            CURRENT_OPTION_LABEL?.includes(CURRENT_INPUT_VALUE) &&
            !VALUE_EXTRACTION_FN(option, selected)
          );
          // return !OPTION_SELECTED
          //   ? getOptionLabel(option)?.toLowerCase()?.includes(inputValue.toLowerCase())
          //   : getOptionLabel(option)?.toLowerCase()?.includes(inputValue.toLowerCase()) &&
          //       getOptionLabel(selected)?.toLowerCase() !== getOptionLabel(option)?.toLowerCase();
        }
      );
    // Exclude options that are already selected
    const newOptions = options.filter(
      (option) =>
        getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase()) &&
        !selected?.some(
          (selectedOption: T) =>
            // getOptionLabel(selectedOption)?.toLowerCase() === getOptionLabel(option)?.toLowerCase()
            (selectedOption as any)?.id === (option as any)?.id
          // compare(selectedOption, option, { ignoreCase: true })
        )
    );
    return [...(newOptions.length > 0 ? ([selectAllOption] as T[]) : []), ...newOptions];
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (type === 'country') {
          return (
            <Autocomplete
              noOptionsText={<span>{t('COMMON.ZERO_OPTIONS')}</span>}
              {...field}
              id={`autocomplete-${name}`}
              ListboxProps={{
                onScroll: handleFetchOnScroll, // Add the scroll event handler
              }}
              autoHighlight={!multiple}
              disableCloseOnSelect={multiple}
              onChange={(event, newValue) =>
                setValue(name, newValue, { shouldValidate: true, shouldDirty: true })
              }
              renderOption={(props, option) => {
                const country = getCountry(option as string);
                if (!country.label) {
                  return null;
                }
                return (
                  <li {...props} key={country.label}>
                    <Iconify
                      key={country.label}
                      icon={`circle-flags:${country.code?.toLowerCase()}`}
                      sx={{ mr: 1 }}
                    />
                    {country.label} ({country.code}) +{country.phone}
                  </li>
                );
              }}
              renderInput={(params) => {
                const country = getCountry(params.inputProps.value as string);
                const baseField = {
                  ...params,
                  label,
                  placeholder,
                  error: !!error,
                  helperText: (
                    <AnimatePresence mode="wait">
                      {error ? (
                        <m.span
                          key="error"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          style={{ display: 'inline-block' }}
                        >
                          {error.message}
                        </m.span>
                      ) : (
                        <m.span key="helper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {helperText || '\u00a0'}
                        </m.span>
                      )}
                    </AnimatePresence>
                  ),
                  FormHelperTextProps: {
                    sx: {
                      minHeight: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      '&.MuiFormHelperText-root': {
                        mx: '0px !important',
                      },
                    },
                  },
                  inputProps: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  },
                };

                return (
                  <TextField
                    {...baseField}
                    sx={textFieldSx}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            ...(!country.code && {
                              display: 'none',
                            }),
                          }}
                        >
                          <Iconify
                            icon={`circle-flags:${country.code?.toLowerCase()}`}
                            sx={{ mr: -0.5, ml: 0.5 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  const country = getCountry(option as string);
                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={country.label}
                      label={country.label}
                      icon={<Iconify icon={`circle-flags:${country.code?.toLowerCase()}`} />}
                      size="small"
                      variant="soft"
                    />
                  );
                })
              }
              {...other}
            />
          );
        }

        return (
          <Autocomplete
            noOptionsText={<span>{t('COMMON.ZERO_OPTIONS')}</span>}
            ListboxProps={{
              onScroll: handleFetchOnScroll, // Add the scroll event handler
            }}
            {...field}
            disableCloseOnSelect={multiple}
            id={`autocomplete-${name}`}
            sx={{
              input: {
                '::placeholder': {
                  fontSize: '14px',
                },
              },
              '& .MuiOutlinedInput-root': {
                // bgcolor: other?.disabled
                //   ? theme.palette.mahd.inputDisabledBackground
                //   : 'transparent',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: other?.disabled ? 'rgba(118,118,118,0.3)' : '#6CC0FF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: other?.disabled ? 'rgba(118,118,118,0.3)' : '#6CC0FF',
                },
              },
            }}
            onChange={(event, newValue, reason, newOption) => {
              if ((newOption?.option as any)?.id === 'SELECT_ALL') newValue = other?.options as any;
              if (onChange) {
                onChange(event, newValue, reason);
              } else {
                setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
              }
            }}
            filterOptions={(options, state) =>
              filterOptions(options, { ...state, selected: field.value })
            }
            renderOption={(props, option: any, state, ownerState) => {
              if (option?.id === 'SELECT_ALL') {
                return (
                  <li {...props} key={option?.id}>
                    {i18n.language === 'ar' ? option?.nameAr : option?.nameEn}
                  </li>
                );
              }
              return (
                <li {...props} key={option?.id}>
                  {renderOption
                    ? renderOption(props, option, state, ownerState)
                    : i18n.language === 'ar'
                      ? option?.nameAr
                      : option?.nameEn}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '& .MuiOutlinedInput-root.MuiOutlinedInput-root': {
                    height: multiple ? 'auto !important' : '48px !important', // Customize based on `multiple`
                  },
                }}
                placeholder={
                  multiple && Array.isArray(field.value) && field.value.length > 0
                    ? ''
                    : placeholder
                }
                error={!!error}
                helperText={
                  <AnimatePresence mode="wait">
                    {error ? (
                      <m.span
                        key="error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-block' }}
                      >
                        {error.message}
                      </m.span>
                    ) : (
                      <m.span key="helper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {helperText || '\u00a0'}
                      </m.span>
                    )}
                  </AnimatePresence>
                }
                FormHelperTextProps={{
                  sx: {
                    minHeight: '18px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                InputProps={{
                  ...params.InputProps, // Preserve existing InputProps (including default end adornments)
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment} {/* Preserve default adornments */}
                      <InputAdornment position="end">
                        {other.loading ? (
                          <CircularProgress sx={{ color: 'white' }} size={22} />
                        ) : (
                          // eslint-disable-next-line react/jsx-no-useless-fragment
                          <></>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
            {...other}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function getCountry(inputValue: string) {
  const option = countries.filter((country) => country.label === inputValue)[0];
  return {
    ...option,
  };
}
