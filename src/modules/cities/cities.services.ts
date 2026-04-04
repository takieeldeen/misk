import CityModel from "../../database/models/cities.model.js";

export class CitiesServices {
  public static async getAllCities() {
    const cities = await CityModel.find()
      .sort({ nameEn: 1 })
      .select("-__v -createdAt -updatedAt");
    return cities;
  }
}
