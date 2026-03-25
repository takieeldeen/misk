import { RequestHandler, Request, Response, NextFunction } from "express";

import { createUserLoginDto, createUserRegisterDto } from "./auth.dto.js";
import AuthService from "./auth.service.js";
import catchAsync from "../../utilities/utilis/catchAsync.js";
import { signToken } from "../../utilities/utilis/jwt.js";

export const registerHandler: RequestHandler = async (req, res) => {
  const userData = createUserRegisterDto(req.body);

  await AuthService.register(userData);

  res.status(200).json({
    status: "success",
  });
};

export const loginHandler: RequestHandler = async (req, res) => {
  const userData = createUserLoginDto(req.body);

  const user = await AuthService.login(userData);

  res.status(200).json({
    status: "success",
  });
};

export const activateAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    const user = await AuthService.activateEmail(token);
    signToken(res, user);

    res.status(200).json({
      status: "success",
      content: user,
    });
  }
);
