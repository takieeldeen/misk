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
