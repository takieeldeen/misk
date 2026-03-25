export interface AuthLoginDTO {
  email: string;
  password: string;
}

export interface AuthRegisterDTO {
  birthDate?: Date;
  email: string;
  gender?: "FEMALE" | "MALE";
  name: string;

  password: string;
  passwordConfirmation: string;
  phone?: string;
}
