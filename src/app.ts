import express from "express";

import APIRouter from "./routers/index.js";
import errorMiddleware from "./utilities/middlware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(APIRouter);
app.use(errorMiddleware);
export default app;
