import { Router } from "express";
import {
  getOverviewHandler,
  getRevenueAnalyticsHandler,
} from "./insights.controller.js";
import requireAuth, {
  requireAdmin,
} from "../../utilities/middlware/auth.middleware.js";

const InsightsRouter = Router();

InsightsRouter.use(requireAuth, requireAdmin);
InsightsRouter.get("/overview", getOverviewHandler);
InsightsRouter.get("/revenue-analytics", getRevenueAnalyticsHandler);

export default InsightsRouter;
