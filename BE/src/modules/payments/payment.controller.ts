import catchAsync from "../../utilities/utilis/catchAsync.js";
import { PaymentService } from "./payments.service.js";

export const paymentWebhookHandler = catchAsync(async (req, res, next) => {
  await PaymentService.handleWebhook(req.body, req?.query?.hmac as string);
  res.status(200).json({ message: "Webhook received" });
});

export const getPaginatedPayments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 9, ...rest } = req.query;
  const payments = await PaymentService.getPaginatedPayments(
    Number(page),
    Number(limit),
    rest as Record<string, string>,
  );
  const paymentsCount = await PaymentService.getPaymentsCount(
    rest as Record<string, string>,
  );
  res.status(200).json({
    status: "success",
    content: payments,
    page: Number(page),
    limit: Number(limit),
    total: paymentsCount,
  });
});

export const getPaymentDetailsHandler = catchAsync(async (req, res, next) => {
  const payment = await PaymentService.getOnePayment(
    req.params.paymentId as string,
  );
  res.status(200).json({
    status: "success",
    data: payment,
  });
});
