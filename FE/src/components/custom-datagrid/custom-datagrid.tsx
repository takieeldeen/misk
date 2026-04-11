'use client';

import type { DataGridProps } from '@mui/x-data-grid';

import { useMemo } from 'react';

import { DataGrid } from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function CustomDataGrid({ localeText, ...other }: DataGridProps) {
  const { t } = useTranslate();

  const gridLocaleText = useMemo(
    () => ({
      toolbarColumns: t('datagrid.columns'),
      toolbarFilters: t('datagrid.filters'),
      toolbarDensity: t('datagrid.density'),
      toolbarExport: t('datagrid.export'),
      toolbarExportCSV: t('datagrid.csv'),
      toolbarExportPrint: t('datagrid.print'),
      noRowsLabel: t('datagrid.noRows'),
      noResultsOverlayLabel: t('datagrid.noResults'),
      columnsManagementShowHideAllText: t('datagrid.showAll'),
      columnsManagementReset: t('datagrid.reset'),
      columnMenuSortAsc: t('datagrid.sortAscending'),
      columnMenuSortDesc: t('datagrid.sortDescending'),
      columnMenuManageColumns: t('datagrid.manageColumns'),
      columnMenuFilter: t('datagrid.filter'),
      filterPanelRemoveAll: t('datagrid.removeAllFilters'),
      filterPanelDeleteIconLabel: t('datagrid.removeFilter'),
      columnMenuHideColumn: t('datagrid.hideColumn'),
      columnMenuUnsort: t('datagrid.unsort'),
      ...localeText,
    }),
    [t, localeText]
  );

  return <DataGrid disableColumnFilter localeText={gridLocaleText} {...other} />;
}
