'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IBrandItem, IBrandTableFilters } from 'src/types/brand';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Pagination, Typography } from '@mui/material';
import {
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBrands, useBrandsParams } from 'src/actions/brand';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomDataGrid } from 'src/components/custom-datagrid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import NewEditForm from '../new-edit-form';
import { ProductTableToolbar } from '../table-toolbar';
import { ProductTableFiltersResult } from '../table-filters-result';
import {
  RenderCellStatus,
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderCellStockCount,
  RenderCellProductCount,
} from '../table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ProductListView() {
  const { t } = useTranslate();

  const confirmRows = useBoolean();

  const router = useRouter();

  const [params, setParams] = useBrandsParams();
  const { data, isFetching } = useGetBrands({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status,
  });

  const brands: IBrandItem[] = useMemo(() => data?.content || [], [data]);

  const productsLoading = isFetching;

  const filters = useMemo(
    () => ({
      state: {
        name: params.name,
        status: params.status,
        page: params.page,
      },
      setState: (update: any) => {
        setParams(update);
      },
      setField: (field: string, value: any) => {
        setParams({ [field]: value });
      },
      canReset: params.status.length > 0 || params.name.length > 0,
      onReset: () => {
        setParams({ name: '', status: [], page: 1 });
      },
      onResetState: () => {
        setParams({ name: '', status: [], page: 1 });
      },
    }),
    [params, setParams]
  );
  const [tableData, setTableData] = useState<IBrandItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (brands.length) {
      setTableData(brands);
    }
  }, [brands]);

  const dataFiltered = brands;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row._id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={filters.canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns: GridColDef[] = [
    { field: 'category', headerName: t('brands.category'), filterable: false },
    {
      field: 'name',
      headerName: t('brands.brand'),
      flex: 1,
      minWidth: 350,
      hideable: false,

      renderCell: (cellParams) => (
        <RenderCellProduct params={cellParams} onViewRow={() => handleViewRow(cellParams.row.id)} />
      ),
    },
    {
      field: 'createdAt',
      headerName: t('brands.created_at'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (cellParams) => <RenderCellCreatedAt params={cellParams} />,
    },
    {
      field: 'products',
      headerName: t('brands.products'),
      width: 140,
      editable: true,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (cellParams) => <RenderCellProductCount params={cellParams} />,
    },
    {
      field: 'stock',
      headerName: t('brands.stock'),
      width: 140,
      editable: true,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (cellParams) => <RenderCellStockCount params={cellParams} />,
    },
    {
      field: 'status',
      headerName: t('brands.status'),
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: STATUS_OPTIONS,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (cellParams) => <RenderCellStatus params={cellParams} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (cellParams) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(cellParams.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(cellParams.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(cellParams.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxWidth: 'unset !important' }}
        maxWidth="xl"
      >
        <CustomBreadcrumbs
          heading={t('brands.list')}
          links={[
            { name: t('navbar.overview'), href: paths.dashboard.root },
            { name: t('navbar.brands'), href: paths.dashboard.brands },
            { name: t('brands.list') },
          ]}
          action={<NewEditForm />}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <CustomDataGrid
            getRowId={(row) => row._id}
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            rowCount={data?.total || 0}
            paginationMode="server"
            hideFooter
            getRowHeight={() => 'auto'}
            paginationModel={{ page: params.page - 1, pageSize: params.pageSize }}
            onFilterModelChange={(newModel) => {
              const quickFilterValue = newModel.quickFilterValues?.[0] || '';
              if (quickFilterValue !== params.name) {
                setParams({ name: quickFilterValue, page: 1 });
              }
            }}
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: [params.name],
                },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl, quickFilterProps: { debounceMs: 500 } },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('datagrid.showing_results', {
              count: data?.content.length || 0,
              total: data?.total || 0,
            })}
          </Typography>

          <Pagination
            count={data?.totalPages || 0}
            page={params.page}
            onChange={(event, value) => {
              setParams({ page: value });
            }}
            shape="rounded"
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          />
        </Stack>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={<>{t('brands.delete_confirm', { count: selectedRowIds.length })}</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<IBrandTableFilters & { page: number }>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  const { t } = useTranslate();
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: STATUS_OPTIONS }}
        />

        {/* <GridToolbarQuickFilter /> */}

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              {t('datagrid.delete_count', { count: selectedRowIds.length })}
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}
