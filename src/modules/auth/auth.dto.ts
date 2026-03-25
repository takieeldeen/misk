import { AuthLoginDTO, AuthRegisterDTO } from "./auth.types.js";

export function createUserLoginDto(body: any): AuthLoginDTO {
  return {
    email: body.email,
    password: body.password,
  };
}

export function createUserRegisterDto(body: unknown): AuthRegisterDTO {
  const b = body as Record<string, any>;

  return {
    birthDate: b.birthDate ? new Date(b.birthDate as string) : undefined,
    email: String(b.email).trim().toLowerCase(),
    gender: b.gender,
    name: String(b.name).trim(),

    password: String(b.password),
    passwordConfirmation: String(b.passwordConfirmation),
    phone: b.phone,
  };
}
