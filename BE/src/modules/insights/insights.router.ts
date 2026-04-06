import { Router } from "express";
import {
  getCustomerAnalyticsHandler,
  getInventoryAlertsHandler,
  getOrdersAnalyticsHandler,
  getOverviewHandler,
  getRevenueAnalyticsHandler,
  getTopSellingProductsHandler,
  getPaymentsInsightsHandler,
} from "./insights.controller.js";
import requireAuth, {
  requireAdmin,
} from "../../utilities/middlware/auth.middleware.js";

const InsightsRouter = Router();

InsightsRouter.use(requireAuth, requireAdmin);
InsightsRouter.get("/overview", getOverviewHandler);
InsightsRouter.get("/revenue-analytics", getRevenueAnalyticsHandler);
InsightsRouter.get("/orders-analytics", getOrdersAnalyticsHandler);
InsightsRouter.get("/top-selling-products", getTopSellingProductsHandler);
InsightsRouter.get("/inventory-alerts", getInventoryAlertsHandler);
InsightsRouter.get("/customers-analytics", getCustomerAnalyticsHandler);
InsightsRouter.get("/payments-analytics", getPaymentsInsightsHandler);

export default InsightsRouter;
