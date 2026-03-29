import { UserInfoDto, UserType } from "./user.types.js";

export function createUserInfoDto(user: UserType): UserInfoDto {
  const userObj =
    (user as any).toObject instanceof Function
      ? (user as any).toObject()
      : user;

  const { ...userInfo } = userObj;

  return userInfo;
}
