import { createHash, randomBytes } from "crypto";
import UserModel from "../../database/models/user.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { comparePassword } from "../../utilities/utilis/hash.js";
import { UserProviders } from "../users/user.types.js";
import { AuthLoginDTO, AuthRegisterDTO } from "./auth.types.js";
import { generateMailTemplate, sendMail } from "../../utilities/utilis/mail.js";

class AuthService {
  public static async login(loginDTO: AuthLoginDTO) {
    const user = await UserModel.findOne({
      email: loginDTO.email,
    }).select("+password");
    if (!user) throw new AppError(400, "INVALID_CREDENTIALS");
    const validCredentials = await comparePassword(
      loginDTO.password,
      user.password,
    );
    if (!validCredentials) throw new AppError(400, "INVALID_CREDENTIALS");
    if (user.status === "INACTIVE") throw new AppError(400, "ACCOUNT_INACTIVE");
    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          lastlogin: new Date(),
        },
      },
    );
    return user;
  }

  public static async register(
    registerDTO: AuthRegisterDTO,
    provider?: UserProviders,
  ) {
    const plainToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(plainToken).digest("hex");
    const userData = { ...registerDTO, provider, activationToken: hashedToken };
    const userExists = !!(await UserModel.findOne({ email: userData.email }));
    if (userExists) throw new AppError(400, "EMAIL_ALREADY_IN_USE");
    const user = await UserModel.create(userData);
    await sendMail({
      to: [userData.email],
      subject: "Misk | Welcome To Misk",
      html: generateMailTemplate({
        title: "Welcome To Misk",
        content:
          "Thank you for signing up to Misk! We are excited to have you on board and look forward to providing you with the best experience possible.",
        user: userData?.email!,
        actionTitle: "Activate Your Account",
        actionSubtitle:
          "To get started, please click the button below to activate your account:",
        actionLink: `${process.env.CLIENT_URL}/sign-up?token=${plainToken}`,
      }),
    });
    return user;
  }

  public static async activateEmail(token: string) {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOneAndUpdate(
      {
        activationToken: hashedToken,
      },
      { $set: { activationToken: null, status: "ACTIVE" } },
      { new: true },
    );
    if (!user) throw new AppError(400, "TOKEN_NOT_FOUND");
    return user;
  }
}

export default AuthService;
