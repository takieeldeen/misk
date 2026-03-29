import { UserInfoDto, UserType } from "./user.types.js";

export function createUserInfoDto(brand: UserType): UserInfoDto {
  const brandObj =
    (brand as any).toObject instanceof Function
      ? (brand as any).toObject()
      : brand;

  const { ...userInfo } = brandObj;

  return userInfo;
}
