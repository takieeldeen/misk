import catchAsync from "../../utilities/utilis/catchAsync.js";
import { CitiesServices } from "./cities.services.js";

export const getAllCitiesHandler = catchAsync(async (req, res, next) => {
  const cities = await CitiesServices.getAllCities();
  res.status(200).json({
    status: "success",
    content: cities,
  });
});
