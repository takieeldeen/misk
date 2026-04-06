import CityModel from "../../models/cities.model.js";
import { CITIES } from "./cities.data.js";

export default async function migrateCities() {
  console.log("Starting cities migration...");

  try {
    await CityModel.insertMany(CITIES, {
      ordered: false,
    });

    console.log("Cities migration completed.");
  } catch (error: any) {
    if (error?.code === 11000) {
      // Expected: duplicates due to unique indexes
      console.log("Cities migration completed with duplicates skipped.");
    } else if (error?.writeErrors?.every((e: any) => e.code === 11000)) {
      // All errors are duplicates
      console.log("Cities migration completed with duplicates skipped.");
    } else {
      // Unexpected error → real failure
      console.error("Migration failed:", error);
      throw error;
    }
  }
}
