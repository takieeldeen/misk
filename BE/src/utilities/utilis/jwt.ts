import jwt from "jsonwebtoken";
import { UserType } from "../../modules/users/user.types.js";
import { Response } from "express";

export async function signToken(res: Response, user: UserType) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.TOKEN_EXP! as any,
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // needed for cross-site cookies
    maxAge: +process.env.TOKEN_COOKIE_AGE!,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
}
