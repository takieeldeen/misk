import type { Theme, SxProps } from '@mui/material/styles';
import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IProductTableFilters & { page: number }>;
};

export function ProductTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { t } = useTranslate();

  const handleRemoveStatus = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.status.filter((item) => item !== inputValue);
      filters.setState({ status: newValue, page: 1 });
    },
    [filters]
  );

  const handleRemoveGender = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.gender.filter((item) => item !== inputValue);
      filters.setState({ gender: newValue, page: 1 });
    },
    [filters]
  );

  const handleRemoveCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.category.filter((item) => item !== inputValue);
      filters.setState({ category: newValue, page: 1 });
    },
    [filters]
  );

  const handleRemoveBrand = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.brand.filter((item) => item !== inputValue);
      filters.setState({ brand: newValue, page: 1 });
    },
    [filters]
  );


  const handleReset = useCallback(() => {
    filters.setState({
      name: '',
      status: [],
      gender: [],
      category: [],
      brand: [],
      page: 1,
    });
  }, [filters]);

  return (
    <Stack spacing={1.5} sx={sx}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
          {t('common.results_found')}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.state.status.length && (
          <Block label={t('common.status')}>
            {filters.state.status.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveStatus(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.state.gender.length && (
          <Block label={t('common.gender')}>
            {filters.state.gender.map((item) => (
              <Chip
                key={item}
                label={t(`common.${item.toLowerCase()}`)}
                size="small"
                onDelete={() => handleRemoveGender(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.state.category.length && (
          <Block label={t('common.category')}>
            {filters.state.category.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveCategory(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.state.brand.length && (
          <Block label={t('common.brand')}>
            {filters.state.brand.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveBrand(item)}
              />
            ))}
          </Block>
        )}


        <Button
          color="error"
          onClick={handleReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          {t('common.clear')}
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = {
  label: string;
  children: React.ReactNode;
};

function Block({ label, children }: BlockProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 1,
        gap: 1,
        borderRadius: 1,
        border: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}:
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {children}
      </Stack>
    </Stack>
  );
}
