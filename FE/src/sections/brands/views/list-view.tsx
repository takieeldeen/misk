'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IBrandItem, IBrandTableFilters } from 'src/types/brand';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { Pagination, Typography } from '@mui/material';
import {
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetBrands,
  useDeleteBrand,
  useBrandsParams,
  useActivateBrand,
  useDeactivateBrand,
  useDeleteManyBrands,
} from 'src/actions/brand';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomDataGrid } from 'src/components/custom-datagrid';

import NewEditForm from '../new-edit-form';
import { ProductTableToolbar } from '../table-toolbar';
import { ProductTableFiltersResult } from '../table-filters-result';
import {
  RenderCellStatus,
  RenderCellProduct,
  RenderCellActions,
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

export function BrandListView() {
  const { t, currentLang } = useTranslate();
  const confirmRows = useBoolean();
  const confirmDeleteRow = useBoolean();
  const confirmToggleStatus = useBoolean();

  const router = useRouter();

  const [params, setParams] = useBrandsParams();
  const { data, isFetching: brandsLoading } = useGetBrands({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status,
    sort: params.sort,
  });

  const brands: IBrandItem[] = useMemo(() => data?.content || [], [data]);
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

  const { mutate: deleteBrand } = useDeleteBrand();
  const { mutate: deleteManyBrands } = useDeleteManyBrands();
  const { mutate: activateBrand } = useActivateBrand();
  const { mutate: deactivateBrand } = useDeactivateBrand();

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [actionRow, setActionRow] = useState<IBrandItem | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteBrand(id, {
        onSuccess: () => {
          toast.success(t('brands.delete_success'));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('brands.delete_error'));
        },
      });
    },
    [deleteBrand, t]
  );
  const handleDeleteRows = useCallback(() => {
    const ids = selectedRowIds.map((id) => id.toString());
    deleteManyBrands(ids, {
      onSuccess: () => {
        toast.success(t('brands.delete_many_success'));
        setSelectedRowIds([]);
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('brands.delete_many_error'));
      },
    });
  }, [selectedRowIds, deleteManyBrands, t]);

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const isCurrentlyActive = currentStatus === 'ACTIVE';
      const action = isCurrentlyActive ? deactivateBrand : activateBrand;

      action(id, {
        onSuccess: () => {
          toast.success(
            isCurrentlyActive ? t('brands.deactivate_success') : t('brands.activate_success')
          );
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('brands.status_error'));
        },
      });
    },
    [activateBrand, deactivateBrand, t]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.brand.details(id));
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
        filteredResults={brands.length}
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
        <RenderCellProduct
          params={cellParams}
          onViewRow={() => handleViewRow(cellParams.row._id)}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: t('brands.created_at'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      renderCell: (cellParams) => <RenderCellActions params={cellParams} />,
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
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          justifyContent="space-between"
          alignItems={{
            xs: 'stretch',
            md: 'center',
          }}
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        >
          <Typography typography="h3" sx={{ fontFamily: 'inherit' }}>
            {t('brands.list')}
          </Typography>
          <NewEditForm
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('brands.new_brand')}
          </NewEditForm>
        </Stack>
        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <CustomDataGrid
            onSortModelChange={(model) => {
              if (model.length > 0) {
                const { field, sort } = model[0];
                let finalField = '';
                if (field === 'nameAr' || field === 'nameEn') {
                  finalField = 'name';
                } else {
                  finalField = field;
                }
                setParams({ sort: sort === 'desc' ? `-${finalField}` : finalField, page: 1 });
              } else {
                setParams({ sort: '', page: 1 });
              }
            }}
            sortModel={
              params.sort
                ? [
                    {
                      field: params.sort.startsWith('-') ? params.sort.substring(1) : params.sort,
                      sort: params.sort.startsWith('-') ? 'desc' : 'asc',
                    },
                  ]
                : []
            }
            getRowId={(row) => row._id}
            checkboxSelection
            disableRowSelectionOnClick
            rows={brands}
            columns={columns}
            loading={brandsLoading}
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
                  quickFilterValues: [],
                },
              },
              sorting: {
                sortModel: [
                  {
                    field: params.sort.startsWith('-') ? params.sort.substring(1) : params.sort,
                    sort: params.sort.startsWith('-') ? 'desc' : 'asc',
                  },
                ],
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
        title={t('brands.delete_many_title')}
        icon={
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              mx: 'auto',
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={56} />
          </Stack>
        }
        cancelLabel={t('brands.cancel')}
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
            {t('brands.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDeleteRow.value}
        onClose={confirmDeleteRow.onFalse}
        title={t('brands.delete_brand_title', {
          name: currentLang.value === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
        })}
        icon={
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              mx: 'auto',
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={56} />
          </Stack>
        }
        cancelLabel={t('brands.cancel')}
        content={<>{t('brands.delete_brand_warning')}</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (actionRow) {
                handleDeleteRow(actionRow._id);
                confirmDeleteRow.onFalse();
                setActionRow(null);
              }
            }}
          >
            {t('brands.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmToggleStatus.value}
        onClose={confirmToggleStatus.onFalse}
        title={
          actionRow?.status === 'ACTIVE'
            ? t('brands.deactivate_brand_title', {
                name: currentLang.value === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
              })
            : t('brands.activate_brand_title', {
                name: currentLang.value === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
              })
        }
        icon={
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              bgcolor: (theme) =>
                alpha(
                  actionRow?.status === 'ACTIVE'
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
                  0.08
                ),
              color: actionRow?.status === 'ACTIVE' ? 'warning.main' : 'success.main',
              mx: 'auto',
            }}
          >
            <Iconify
              icon={
                actionRow?.status === 'ACTIVE'
                  ? 'solar:close-circle-bold'
                  : 'solar:check-circle-bold'
              }
              width={56}
            />
          </Stack>
        }
        cancelLabel={t('brands.cancel')}
        content={
          <>
            {actionRow?.status === 'ACTIVE'
              ? t('brands.deactivate_brand_warning')
              : t('brands.activate_brand_warning')}
          </>
        }
        action={
          <Button
            variant="contained"
            color={actionRow?.status === 'ACTIVE' ? 'warning' : 'success'}
            onClick={() => {
              if (actionRow) {
                handleToggleStatus(actionRow._id, actionRow.status);
                confirmToggleStatus.onFalse();
                setActionRow(null);
              }
            }}
          >
            {actionRow?.status === 'ACTIVE' ? t('brands.deactivate') : t('brands.activate')}
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

          <GridToolbarColumnsButton ref={setFilterButtonEl} />
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
