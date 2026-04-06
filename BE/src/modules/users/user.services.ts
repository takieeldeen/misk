import UserModel from "../../database/models/user.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { UserType } from "./user.types.js";

export class UserServices {
  public static async getPaginatedUsers(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string>
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    const brands = await UserModel.find(query)
      .skip(skip > 0 ? skip : 0)
      .limit(limit)
      .sort({ createdAt: -1 });
    return brands;
  }

  public static async getUserDetails(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(404, "USER_NOT_FOUND");
    return user;
  }

  public static async deleteUser(userId: string) {
    const user = await UserModel.findByIdAndDelete(userId);
    return user;
  }

  public static async updateUser(userId: string, userData: Partial<UserType>) {
    const user = await UserModel.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
      runValidators: true,
    });
    return user;
  }

  public static async activateUser(userId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        status: "ACTIVE",
      },
      {
        runValidators: true,
        returnDocument: "after",
      }
    );
    return user;
  }

  public static async deactivateUser(userId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        status: "INACTIVE",
      },
      {
        runValidators: true,
        returnDocument: "after",
      }
    );
    return user;
  }

  public static async getUsersCount(filters: Record<string, string>) {
    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    const count = await UserModel.countDocuments(query);
    return count;
  }
}
