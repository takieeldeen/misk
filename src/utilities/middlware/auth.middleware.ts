import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import UserModel from "../../database/models/user.model.js";
import { AppError } from "../utilis/error.js";
import catchAsync from "../utilis/catchAsync.js";
import { UserType } from "../../modules/users/user.types.js";

declare module "express" {
  interface Request {
    user?: UserType;
  }
}

const requireAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1) Extract token from cookies or Auth header
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.trim().split("=")[1];
      }
    }

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2) Verify token exists
    if (!token) {
      return next(new AppError(401, "AUTHENTICATION_REQUIRED"));
    }

    try {
      // 3) Verify and decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        iat: number;
      };

      // 4) Check if user still exists
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return next(new AppError(401, "USER_NOT_FOUND"));
      }

      // 5) Check if password was changed after token was issued
      if (user.passwordChangedAt) {
        const changedTimestamp = Math.floor(
          user.passwordChangedAt.getTime() / 1000,
        );
        console.log(
          decoded.iat,
          changedTimestamp,
          decoded.iat < changedTimestamp,
        );
        if (decoded.iat < changedTimestamp) {
          res.cookie("token", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });
          return next(new AppError(401, "PASSWORD_CHANGED_PLEASE_LOGIN_AGAIN"));
        }
      }

      // 6) Grant access
      req.user = user;
      next();
    } catch (error) {
      return next(new AppError(401, "INVALID_TOKEN"));
    }
  },
);

export default requireAuth;
