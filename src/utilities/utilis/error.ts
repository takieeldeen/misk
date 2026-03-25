import { Request, Response } from "express";
import mongoose from "mongoose";

export class AppError extends Error {
  public status: "fail" | "error" = "error";
  public isOperationalError: boolean = false;
  public isFormError: boolean = false;
  public statusCode: number = 500;
  public constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    if (this.statusCode.toString().startsWith("4")) {
      this.status = "fail";
      this.isOperationalError = true;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export class FormError extends Error {
  public status: "fail" | "error";
  public isOperationalError: boolean = true;
  public isFormError: boolean = true;

  public constructor(
    public statusCode: number,
    public message: string,
    public errorObject: { [fieldName: string]: string }
  ) {
    super(message);
    this.status = this.statusCode?.toString()?.startsWith("4")
      ? "fail"
      : "error";
  }
}

export const handleMongoServerError = (error: any) => {
  const errorObject: { [fieldName: string]: string } = {};
  const errorKey = Object.keys(error.keyValue ?? {})?.[0]!;
  if (!errorKey) return new AppError(400, error?.message);
  errorObject[errorKey] = `VALIDATIONS.UNIQUE_FIELD:${errorKey}`;
  return new FormError(400, "Validation Errors", errorObject);
};
export const handleValidationErrors = (
  error: mongoose.Error.ValidationError
) => {
  const errorObject: { [fieldName: string]: string } = {};
  if (error?.errors && Object?.keys(error?.errors)?.length > 0) {
    Object.keys(error.errors)?.forEach((errorKey: string) => {
      errorObject[errorKey] = error?.errors?.[errorKey]?.message ?? "";
    });
  }
  return new FormError(400, "Validation Errors", errorObject);
};
export const handleCastErrors = (error: mongoose.Error.CastError) => {
  return new AppError(400, `VALIDATIONS.CAST_ERROR: ${error.path}`);
};

export const generateDevelopmentError = (
  req: Request,
  res: Response,
  error: AppError | FormError,
  originalError: any
) => {
  return res.status(error?.statusCode ?? 500).json({
    status: error?.status ?? "error",
    message: error?.message ?? "Something Went wrong",
    isOperationalError: error?.isOperationalError ?? false,
    isFormError: error?.isFormError ?? false,
    stack: error?.stack,
    error,
    originalError,
  });
};

export const generateProductionError = (
  req: Request,
  res: Response,
  error: AppError | FormError
) => {
  return res.status(error.statusCode ?? 500).json({
    status: error?.isOperationalError ? error.status : "error",
    isOperationalError: error?.isOperationalError,
    isFormError: error?.isFormError,
    message: error?.isOperationalError
      ? error?.message
      : "Something Went Wrong",
    ...(error?.isFormError ? (error as any)?.errorObject : {}),
  });
};
