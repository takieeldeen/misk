import type { IBrandTableFilters } from 'src/types/brand';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { sentenceCase } from 'src/utils/change-case';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IBrandTableFilters & { page: number }>;
};

export function ProductTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveStatus = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.status.filter((item) => item !== inputValue);

      filters.setState({ status: newValue, page: 1 });
    },
    [filters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Status:" isShow={!!filters.state.status.length}>
        {filters.state.status.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={sentenceCase(item)}
            onDelete={() => handleRemoveStatus(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
