import { Router } from "express";
import { paymentWebhookHandler } from "./payment.controller.js";

const PaymentRouter = Router();

PaymentRouter.post("/webhook", paymentWebhookHandler);

export default PaymentRouter;
