import { NextFunction, Request, Response } from "express";
import { UserType } from "../../modules/users/user.types.js";

declare module "express" {
  interface Request {
    user?: UserType;
  }
}

export interface ProtectedRequest extends Request {
  user?: UserType;
}

type ControllerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function catchAsync(controllerFn: ControllerFn) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (err: any) {
      return next(err);
    }
  };
}
