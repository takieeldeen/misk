import express from "express";

import APIRouter from "./routers/index.js";
import errorMiddleware from "./utilities/middlware/error.middleware.js";
import cron from "node-cron";
import { OrdersServices } from "./modules/orders/orders.service.js";

const app = express();

app.use(express.json());
app.use(APIRouter);
app.use(errorMiddleware);
// Background tasks
cron.schedule("15 * * * *", async () => {
  console.log("Cleanup job was fired");
  await OrdersServices.restoreIdleStock();
});

export default app;
