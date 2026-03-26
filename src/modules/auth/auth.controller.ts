import { RequestHandler, Request, Response, NextFunction } from "express";

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
  const user = (req as any).user;

  res.status(200).json({
    status: "success",
    content: createUserInfoDto(user),
  });
});

export const forgetPasswordHandler = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError(400, "EMAIL_REQUIRED"));
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError(404, "USER_NOT_FOUND");
  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendMail({
    to: [user.email],
    subject: "Misk | Reset Password",
    html: generateMailTemplate({
      title: "Reset Password",
      content:
        "You requested to reset your password. Click the button below to reset it:",
      user: user.email,
      actionTitle: "Reset Password",
      actionSubtitle:
        "To get started, please click the button below to reset your password:",
      actionLink: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
    }),
  });
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
    // const { data, error } = await supabase.storage
    //   .from('user-photos')
    //   .upload(`user-${req.user!._id}-${Date.now()}.jpg`, req.file.buffer, {
    //     contentType: req.file.mimetype,
    //   });
    // if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    // updateData.imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/user-photos/${data.path}`;
    console.log(
      "Image buffer available for upload to Supabase",
      req.file.buffer,
    );
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
