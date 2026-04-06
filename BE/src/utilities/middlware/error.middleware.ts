import { NextFunction, Request, Response } from "express";
import {
  generateDevelopmentError,
  generateProductionError,
  handleCastErrors,
  handleMongoServerError,
  handleValidationErrors,
} from "../utilis/error.js";

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }
  let finalError = Object.create(Object.getPrototypeOf(error));
  Object.assign(finalError, error);
  finalError.message = error.message;
  switch (error?.name) {
    case "MongoServerError":
      finalError = handleMongoServerError(error);
      break;
    case "ValidationError":
      finalError = handleValidationErrors(error);
      break;
    case "CastError":
      finalError = handleCastErrors(error);
      break;
  }
  if (process.env.NODE_ENV === "development") {
    console.log("ERROR :", error);
    return generateDevelopmentError(req, res, finalError, error);
  }
  if (process.env.NODE_ENV === "production") {
    console.log("ERROR:", error);
    return generateProductionError(req, res, finalError);
  }
};

export default errorMiddleware;
