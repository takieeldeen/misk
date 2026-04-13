'use client';

import type { IProductItem } from 'src/types/product';
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

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetProducts,
  useDeleteProduct,
  useProductsParams,
  useActivateProduct,
  useDeactivateProduct,
} from 'src/actions/product';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomDataGrid } from 'src/components/custom-datagrid';

import { ProductTableToolbar } from '../table-toolbar';
import { ProductTableFiltersResult } from '../table-filters-result';
import {
  RenderCellBrand,
  RenderCellStatus,
  RenderCellGender,
  RenderCellProduct,
  RenderCellActions,
  RenderCellCategory,
  RenderCellCreatedAt,
} from '../table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: true, brand: true };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'brand', 'actions'];

// ----------------------------------------------------------------------

export default function ListView() {
  const { t, currentLang } = useTranslate();
  const confirmDeleteRow = useBoolean();
  const confirmToggleStatus = useBoolean();

  const router = useRouter();

  const [params, setParams] = useProductsParams();
  const { data, isFetching: productsLoading } = useGetProducts({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status,
    category: params.category,
    brand: params.brand,
    gender: params.gender,
    sort: params.sort,
  });
  console.log(data, 'test');

  const products: IProductItem[] = useMemo(() => data?.content || [], [data]);

  const filters = useMemo(
    () => ({
      state: {
        name: params.name,
        status: params.status,
        category: params.category,
        brand: params.brand,
        gender: params.gender,
        page: params.page,
      },
      setState: (update: any) => {
        setParams(update);
      },
      setField: (field: string, value: any) => {
        setParams({ [field]: value });
      },
      canReset:
        params.status.length > 0 ||
        params.name.length > 0 ||
        params.gender !== '' ||
        params.category !== '' ||
        params.brand !== '',
      onReset: () => {
        setParams({ name: '', status: [], gender: '', category: '', brand: '', page: 1 });
      },
    }),
    [params, setParams]
  );

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: activateProduct } = useActivateProduct();
  const { mutate: deactivateProduct } = useDeactivateProduct();

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [actionRow, setActionRow] = useState<IProductItem | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteProduct(id, {
        onSuccess: () => {
          toast.success(t('common.delete_success'));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('common.delete_error'));
        },
      });
    },
    [deleteProduct, t]
  );

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const isCurrentlyActive = currentStatus === 'ACTIVE';
      const action = isCurrentlyActive ? deactivateProduct : activateProduct;

      action(id, {
        onSuccess: () => {
          toast.success(
            isCurrentlyActive ? t('common.deactivate_success') : t('common.activate_success')
          );
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('common.status_error'));
        },
      });
    },
    [activateProduct, deactivateProduct, t]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      // router.push(paths.dashboard.product.details(id));
      console.log('View row', id);
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      // router.push(paths.dashboard.product.edit(id));
      console.log('Edit row', id);
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <GridToolbarContainer>
        <ProductTableToolbar filters={filters as any} />
        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <GridToolbarColumnsButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>
    ),
    [filters, setFilterButtonEl]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('common.product'),
        flex: 1,
        minWidth: 300,
        renderCell: (cellParams) => (
          <RenderCellProduct
            params={cellParams}
            onViewRow={() => handleViewRow(cellParams.row._id)}
          />
        ),
      },
      {
        field: 'createdAt',
        headerName: t('common.created_at'),
        width: 110,
        align: 'center',
        headerAlign: 'center',
        renderCell: (cellParams) => <RenderCellCreatedAt params={cellParams} />,
      },
      {
        field: 'status',
        headerName: t('common.status'),
        width: 110,
        align: 'center',
        headerAlign: 'center',
        renderCell: (cellParams) => <RenderCellStatus params={cellParams} />,
      },
      {
        field: 'category',
        headerName: t('common.category'),
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (cellParams) => <RenderCellCategory params={cellParams} />,
      },
      {
        field: 'brand',
        headerName: t('common.brand'),
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (cellParams) => <RenderCellBrand params={cellParams} />,
      },
      {
        field: 'gender',
        headerName: t('common.gender'),
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (cellParams) => <RenderCellGender params={cellParams} />,
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
        renderCell: (cellParams) => (
          <RenderCellActions
            params={cellParams}
            onViewRow={() => handleViewRow(cellParams.row._id)}
            onEditRow={() => handleEditRow(cellParams.row._id)}
            onDeleteRow={() => {
              setActionRow(cellParams.row);
              confirmDeleteRow.onTrue();
            }}
            onToggleStatus={() => {
              setActionRow(cellParams.row);
              confirmToggleStatus.onTrue();
            }}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, handleViewRow, handleEditRow, currentLang.value]
  );

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
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <Typography typography="h3" fontFamily="inherit">
            {t('common.products_catalog')}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => console.log('New Product')}
          >
            {t('common.new_product')}
          </Button>
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
            rows={products}
            columns={columns}
            loading={productsLoading}
            rowCount={data?.total || 0}
            paginationMode="server"
            hideFooter
            getRowHeight={() => 'auto'}
            paginationModel={{ page: params.page - 1, pageSize: params.pageSize }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
          {filters.canReset && (
            <ProductTableFiltersResult
              filters={filters as any}
              totalResults={data?.total || 0}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
        </Card>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('datagrid.showing_results', {
              count: products.length,
              total: data?.total || 0,
            })}
          </Typography>

          <Pagination
            count={data?.totalPages || 0}
            page={params.page}
            onChange={(event, value) => setParams({ page: value })}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </DashboardContent>

      <ConfirmDialog
        open={confirmDeleteRow.value}
        onClose={confirmDeleteRow.onFalse}
        title={t('common.delete')}
        content={t('common.delete_confirm_single')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (actionRow) handleDeleteRow(actionRow._id);
              confirmDeleteRow.onFalse();
            }}
          >
            {t('common.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmToggleStatus.value}
        onClose={confirmToggleStatus.onFalse}
        title={actionRow?.status === 'ACTIVE' ? t('common.deactivate') : t('common.activate')}
        content={t('common.status_confirm')}
        action={
          <Button
            variant="contained"
            color={actionRow?.status === 'ACTIVE' ? 'warning' : 'success'}
            onClick={() => {
              if (actionRow) handleToggleStatus(actionRow._id, actionRow.status);
              confirmToggleStatus.onFalse();
            }}
          >
            {actionRow?.status === 'ACTIVE' ? t('common.deactivate') : t('common.activate')}
          </Button>
        }
      />
    </>
  );
}
