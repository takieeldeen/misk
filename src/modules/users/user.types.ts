export type UserProviders = "GOOGLE" | "LOCAL";

export interface UserType {
  _id: string;
  activationToken?: string;
  birthDate?: Date;
  createdAt: Date;
  email: string;
  gender?: "FEMALE" | "MALE";
  imageUrl?: string;
  name: string;
  password: string;
  phone?: string;
  provider: UserProviders;
  status: "ACTIVE" | "INACTIVE";
  lastlogin?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
}

export interface UserInfoDto {
  _id: string;
  activationToken?: string;
  birthDate?: Date;
  createdAt: Date;
  email: string;
  gender?: "FEMALE" | "MALE";
  imageUrl?: string;
  name: string;
  password: string;
  phone?: string;
  provider: UserProviders;
  status: "ACTIVE" | "INACTIVE";
  lastlogin?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
}
