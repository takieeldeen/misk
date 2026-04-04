import mongoose from "mongoose";
import { CityType } from "../../modules/cities/cities.type.js";

const CitySchema = new mongoose.Schema<CityType>(
  {
    nameAr: {
      type: String,
      required: true,
      unique: true,
    },
    nameEn: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const CityModel = mongoose.model<CityType>("City", CitySchema);

export default CityModel;
