'use client';

import type { ICategoryItem } from 'src/types/category';
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
  useGetCategories,
  useDeleteCategory,
  useCategoriesParams,
  useActivateCategory,
  useDeactivateCategory,
  useDeleteManyCategories,
} from 'src/actions/category';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomDataGrid } from 'src/components/custom-datagrid';

import NewEditForm from '../new-edit-form';
import { TableToolbar } from '../table-toolbar';
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

export function CategoryListView() {
  const { t, i18n } = useTranslate();

  const confirmRows = useBoolean();
  const confirmDeleteRow = useBoolean();
  const confirmToggleStatus = useBoolean();

  const router = useRouter();

  const [params, setParams] = useCategoriesParams();
  const { data, isFetching: categoriesLoading } = useGetCategories({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status,
    sort: params.sort,
  });

  const categories: ICategoryItem[] = useMemo(() => data?.content || [], [data]);
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

  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: deleteManyCategories } = useDeleteManyCategories();
  const { mutate: activateCategory } = useActivateCategory();
  const { mutate: deactivateCategory } = useDeactivateCategory();

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [actionRow, setActionRow] = useState<ICategoryItem | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteCategory(id, {
        onSuccess: () => {
          toast.success(t('categories.delete_success'));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('categories.delete_error'));
        },
      });
    },
    [deleteCategory, t]
  );

  const handleDeleteRows = useCallback(() => {
    const ids = selectedRowIds.map((id) => id.toString());
    deleteManyCategories(ids, {
      onSuccess: () => {
        toast.success(t('categories.delete_many_success'));
        setSelectedRowIds([]);
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('categories.delete_many_error'));
      },
    });
  }, [selectedRowIds, deleteManyCategories, t]);

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const isCurrentlyActive = currentStatus === 'ACTIVE';
      const action = isCurrentlyActive ? deactivateCategory : activateCategory;

      action(id, {
        onSuccess: () => {
          toast.success(
            isCurrentlyActive
              ? t('categories.deactivate_success')
              : t('categories.activate_success')
          );
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('categories.status_error'));
        },
      });
    },
    [activateCategory, deactivateCategory, t]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.categories.details(id));
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
        filteredResults={categories.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    [filters, selectedRowIds, categories.length, confirmRows.onTrue]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('categories.category'),
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
      headerName: t('categories.created_at'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      filterable: false,
      renderCell: (cellParams) => <RenderCellCreatedAt params={cellParams} />,
    },
    {
      field: 'products',
      headerName: t('categories.products'),
      width: 140,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      filterable: false,
      renderCell: (cellParams) => <RenderCellProductCount params={cellParams} />,
    },
    {
      field: 'stock',
      headerName: t('categories.stock'),
      width: 140,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      filterable: false,
      renderCell: (cellParams) => <RenderCellStockCount params={cellParams} />,
    },
    {
      field: 'status',
      headerName: t('categories.status'),
      width: 110,
      type: 'singleSelect',
      valueOptions: STATUS_OPTIONS,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      filterable: false,
      renderCell: (cellParams) => <RenderCellStatus params={cellParams} />,
    },
    {
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
            {t('categories.list')}
          </Typography>
          <NewEditForm
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('categories.new_category')}
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
          {/* <ProductTableFiltersResult
            filters={filters}
            totalResults={data?.total || 0}
            sx={{ p: 2.5, pt: 0 }}
          /> */}

          <CustomDataGrid
            onSortModelChange={(model) => {
              if (model.length > 0) {
                const { field, sort } = model[0];
                setParams({ sort: sort === 'desc' ? `-${field}` : field, page: 1 });
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
            rows={categories}
            columns={columns}
            loading={categoriesLoading}
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
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
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
          />
        </Stack>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title={t('categories.delete_many_title')}
        content={<>{t('categories.delete_confirm', { count: selectedRowIds.length })}</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            {t('categories.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDeleteRow.value}
        onClose={confirmDeleteRow.onFalse}
        title={t('categories.delete_category_title', {
          name: i18n.language === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
        })}
        content={<>{t('categories.delete_category_warning')}</>}
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
            {t('categories.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmToggleStatus.value}
        onClose={confirmToggleStatus.onFalse}
        title={
          actionRow?.status === 'ACTIVE'
            ? t('categories.deactivate_category_title', {
                name: i18n.language === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
              })
            : t('categories.activate_category_title', {
                name: i18n.language === 'ar' ? actionRow?.nameAr : actionRow?.nameEn,
              })
        }
        content={
          <>
            {actionRow?.status === 'ACTIVE'
              ? t('categories.deactivate_category_warning')
              : t('categories.activate_category_warning')}
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
            {actionRow?.status === 'ACTIVE' ? t('categories.deactivate') : t('categories.activate')}
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
  filters: any;
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
    <GridToolbarContainer>
      <TableToolbar
        filters={filters}
        options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: STATUS_OPTIONS }}
      />

      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
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
  );
}
