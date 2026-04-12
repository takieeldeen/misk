import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { ICategoryTableFilters } from 'src/types/category';

import { useTranslate } from 'src/locales';

import { FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<ICategoryTableFilters & { page: number }>;
};

export function ProductTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { t } = useTranslate();

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label={t('common.status')} isShow={!!filters.state.status.length}>
        {/* Status filters chip logic here */}
        <div />
      </FiltersBlock>

      <FiltersBlock label={t('common.name')} isShow={!!filters.state.name}>
        {/* Name filters chip logic here */}
        <div />
      </FiltersBlock>
    </FiltersResult>
  );
}
