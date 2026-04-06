import catchAsync from "../../utilities/utilis/catchAsync.js";
import { AppError } from "../../utilities/utilis/error.js";
import { uploadFile } from "../../utilities/utilis/supabase.js";
import { UserServices } from "./user.services.js";

export const getOneUserHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await UserServices.getUserDetails(userId as any);
  res.status(200).json({
    status: "success",
    content: user,
  });
});

export const getPaginatedUsersHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 9, ...filters } = req.query;
  const brands = await UserServices.getPaginatedUsers(
    Number(page),
    Number(limit),
    filters as Record<string, string>
  );
  const brandsCount = await UserServices.getUsersCount(
    filters as Record<string, string>
  );
  res.status(200).json({
    status: "success",
    content: brands,
    page: Number(page),
    limit: Number(limit),
    total: brandsCount,
  });
});

export const updateUserHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const userData = req?.body;
  if (req.file) {
    const { publicUrl, error } = await uploadFile(
      req.file as any,
      `${userData.name.split(" ").join("-").toLowerCase()}`,
      "MISK_BUCKET",
      "profile_pics/"
    );
    if (error) throw new AppError(500, "IMAGE_UPLOAD_FAILED");
    userData.imageUrl = publicUrl;
  }

  const updatedUser = await UserServices.updateUser(userId as any, userData);
  res.status(200).json({
    status: "success",
    content: updatedUser,
  });
});

export const deleteUserHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await UserServices.deleteUser(userId as any);
  res.status(200).json({
    status: "success",
    content: deletedUser,
  });
});

export const activateUserHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const activatedUser = await UserServices.activateUser(userId as any);
  res.status(200).json({
    status: "success",
    content: activatedUser,
  });
});

export const deactivateUserHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const deactivatedUser = await UserServices.deactivateUser(userId as any);
  res.status(200).json({
    status: "success",
    content: deactivatedUser,
  });
});
