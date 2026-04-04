import { Router } from "express";
import {
  getPaginatedPayments,
  paymentWebhookHandler,
  getPaymentDetailsHandler,
} from "./payment.controller.js";
import requireAuth, {
  requireAdmin,
} from "../../utilities/middlware/auth.middleware.js";

const PaymentRouter = Router();

PaymentRouter.post("/webhook", paymentWebhookHandler);
PaymentRouter.get("/", requireAuth, requireAdmin, getPaginatedPayments);
PaymentRouter.get(
  "/:paymentId",
  requireAuth,
  requireAdmin,
  getPaymentDetailsHandler,
);

export default PaymentRouter;
