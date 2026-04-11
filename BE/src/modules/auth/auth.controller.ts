import { RequestHandler, Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import {
  createUserInfoDto,
  createUserLoginDto,
  createUserRegisterDto,
} from "./auth.dto.js";
import AuthService from "./auth.service.js";
import catchAsync from "../../utilities/utilis/catchAsync.js";
import { signToken } from "../../utilities/utilis/jwt.js";
import { AppError } from "../../utilities/utilis/error.js";
import { createHash, randomBytes } from "crypto";
import UserModel from "../../database/models/user.model.js";
import { generateMailTemplate, sendMail } from "../../utilities/utilis/mail.js";
import { uploadFile } from "../../utilities/utilis/supabase.js";

export const registerHandler: RequestHandler = catchAsync(async (req, res) => {
  const userData = createUserRegisterDto(req.body);

  await AuthService.register(userData);

  res.status(200).json({
    status: "success",
  });
});

export const loginHandler: RequestHandler = catchAsync(async (req, res) => {
  const userData = createUserLoginDto(req.body);

  const user = await AuthService.login(userData);

  signToken(res, user);

  res.status(200).json({
    status: "success",
    content: createUserInfoDto(user),
  });
});

export const logoutHandler: RequestHandler = (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

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
      content: createUserInfoDto(user),
    });
  },
);

export const getMeHandler: RequestHandler = catchAsync(async (req, res) => {
  try {
    let token: string | undefined;
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.trim().split("=")[1];
      }
    }
    if (!token) {
      res.status(200).json({
        status: "success",
        content: null,
      });
      return;
    }
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    // 4) Check if user still exists
    const user = await UserModel.findById(decoded.id).select("+isAdmin");
    if (!user) {
      res.status(200).json({
        status: "success",
        content: null,
      });
      return;
    }
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );

      if (decoded.iat < changedTimestamp) {
        res.cookie("token", "loggedout", {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({
          status: "success",
          content: null,
        });
        return;
      }
    }
    res.status(200).json({
      status: "success",
      content: createUserInfoDto(user),
    });
  } catch (error) {
    res.status(200).json({
      status: "success",
      content: null,
    });
  }
});

export const forgetPasswordHandler = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  await AuthService.forgetPassword(email);
  res.status(200).json({
    status: "success",
    message: "Reset password email sent",
  });
});

export const resetPasswordHandler = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(new AppError(400, "MISSING_PARAMETER_TOKEN_OR_PASSWORD"));
  }

  const hashedToken = createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(400, "INVALID_TOKEN_OR_EXPIRED"));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  signToken(res, user);

  res.status(200).json({
    status: "success",
    content: createUserInfoDto(user),
  });
});

export const changePasswordHandler = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError(400, "MISSING_PARAMETER_PASSWORD"));
  }

  const user = req.user as any;
  user.password = password;

  await user.save();

  signToken(res, user);

  res.status(200).json({
    status: "success",
    content: createUserInfoDto(user),
  });
});

export const updateMeHandler = catchAsync(async (req, res, next) => {
  const { birthDate, gender, phone } = req.body;

  const updateData: any = {};
  if (birthDate) updateData.birthDate = new Date(birthDate);
  if (gender) updateData.gender = gender;
  if (phone) updateData.phone = phone;

  if (req.file) {
    // TODO: Implement image upload to Supabase bucket
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${req.user!._id}.${(req.file as any).originalname.split(".").pop()}`,

      "MISK_BUCKET",
      "profile_pics/",
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    updateData.imageUrl = publicUrl;
  }

  const user = await UserModel.findByIdAndUpdate(req.user!._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    content: createUserInfoDto(user!),
  });
});
