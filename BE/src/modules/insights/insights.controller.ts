import OrdersModel from "../../database/models/orders.model.js";
import UserModel from "../../database/models/user.model.js";
import catchAsync from "../../utilities/utilis/catchAsync.js";
import PaymentModel from "../payments/payments.model.js";
import { InsightsService } from "./insights.service.js";

export const getOverviewHandler = catchAsync(async (req, res, next) => {
  const overview = await InsightsService.getOverview();
  res.status(200).json({
    status: "success",
    data: overview,
  });
});

export const getRevenueAnalyticsHandler = catchAsync(async (req, res, next) => {
  const revenueAnalytics = await InsightsService.getRevenueAnalytics(
    req?.query?.range as "7d" | "30d" | "12m",
  );
  res.status(200).json({
    status: "success",
    data: revenueAnalytics,
  });
});

export const getOrdersAnalyticsHandler = catchAsync(async (req, res, next) => {
  const ordersAnalytics = await InsightsService.getOrdersAnalytics(
    req?.query?.range as "7d" | "30d" | "12m",
  );
  res.status(200).json({
    status: "success",
    data: ordersAnalytics,
  });
});

export const getTopSellingProductsHandler = catchAsync(
  async (req, res, next) => {
    const topSellingProducts = await InsightsService.getTopSellingProducts();
    res.status(200).json({
      status: "success",
      data: topSellingProducts,
    });
  },
);

export const getInventoryAlertsHandler = catchAsync(async (req, res, next) => {
  const inventoryAlerts = await InsightsService.getInventoryAlerts();
  res.status(200).json({
    status: "success",
    data: inventoryAlerts,
  });
});

export const getCustomerAnalyticsHandler = catchAsync(
  async (req, res, next) => {
    const customerAnalytics = await InsightsService.getCustomerAnalytics();
    res.status(200).json({
      status: "success",
      data: customerAnalytics,
    });
  },
);

export const getPaymentsInsightsHandler = catchAsync(async (req, res, next) => {
  const paymentsInsights = await InsightsService.getPaymentsInsights();
  res.status(200).json({
    status: "success",
    data: paymentsInsights,
  });
});
