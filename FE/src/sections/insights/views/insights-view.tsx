'use client';

import React from 'react';
import dayjs from 'dayjs';

import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { _stockAlerts, _topSellingProducts } from 'src/_mock';

import { StockAlert } from '../stock-alerts';
import { EcommerceYearlySales } from '../yearly-sales';
import { EcommerceSaleByGender } from '../sale-by-gender';
import { EcommerceWidgetSummary } from '../widget-summary';
import { TopSellingProducts } from '../top-selling-products';

export default function InsightsView() {
  const theme = useTheme();
  const { t } = useTranslate();

  const monthsLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) =>
    dayjs().month(m).format('MMM')
  );

  return (
<<<<<<< HEAD
    <Container maxWidth="xl" sx={{ my: 10 }}>
=======
    <Container sx={{ my: 10, minWidth: '100%' }}>
>>>>>>> 2f820c9bb4895ab14c40fc1c40f997b586e562bc
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('insights.product_sold')}
            percent={2.6}
            total={765}
            chart={{
              categories: monthsLabels.slice(0, 8),
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            id="demo__3"
            title={t('insights.total_balance')}
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              categories: monthsLabels.slice(0, 8),
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('insights.sales_profit')}
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
              categories: monthsLabels.slice(0, 8),
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title={t('insights.sale_by_gender')}
            total={2324}
            chart={{
              series: [
                { label: t('insights.mens'), value: 25 },
                { label: t('insights.womens'), value: 50 },
                { label: t('insights.neutral'), value: 75 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            sx={{
              height: '100%',
            }}
            id="demo__4"
            title={t('insights.yearly_sales')}
            subheader={t('insights.than_last_year')}
            chart={{
              categories: monthsLabels,
              series: [
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Sales',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <TopSellingProducts
            title={t('insights.top_selling_products')}
            tableData={_topSellingProducts}
            headLabel={[
              { id: 'image', label: '' },
              { id: 'name', label: t('insights.product_name') },
              { id: 'sold', label: t('insights.sold') },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <StockAlert
            title={t('insights.stock_alerts')}
            list={_stockAlerts}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
