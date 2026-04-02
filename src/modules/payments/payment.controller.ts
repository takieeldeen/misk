import catchAsync from "../../utilities/utilis/catchAsync.js";
import { PaymentService } from "./payments.service.js";

export const paymentWebhookHandler = catchAsync(async (req, res, next) => {
  await PaymentService.handleWebhook(req.body, req?.query?.hmac as string);
  res.status(200).json({ message: "Webhook received" });
});
