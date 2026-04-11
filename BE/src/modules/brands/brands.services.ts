import { AppError } from "../../utilities/utilis/error.js";
import BrandsModel from "../../database/models/brands.model.js";
import { BrandCreationDto } from "./brands.type.js";

export class BrandsServices {
  public static async createBrand(brandData: BrandCreationDto) {
    const newBrand = await BrandsModel.create(brandData);
    return newBrand;
  }

  public static async getOneBrand(brandId: string) {
    const brand = await BrandsModel.findById(brandId);
    if (!brand) throw new AppError(404, "BRAND_NOT_FOUND");
    return brand;
  }

  public static async getPaginatedBrands(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string>,
    locale: "ar" | "en",
  ) {
    const finalLocale = `${locale[0].toUpperCase()}${locale.slice(1).toLowerCase()}`;
    const skip = (page - 1) * limit;

    const query: any = {
      status: filters.status
        ? { $in: filters.status.split(",") }
        : { $in: ["ACTIVE", "INACTIVE"] },
    };
    const sortObj: any = {};
    if (filters.sort) {
      const sortBy = filters?.sort?.[0] === "-" ? -1 : 1;
      let sortField = filters.sort.startsWith("-")
        ? filters.sort.slice(1).toLowerCase()
        : filters.sort.toLowerCase();
      sortField = sortField === "name" ? "name" + finalLocale : sortField;
      sortObj[sortField] = sortBy;
      console.log(sortObj, filters.sort);
    } else {
      sortObj.createdAt = -1;
    }
    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    const brands = await BrandsModel.aggregate([
      { $match: query },
      { $sort: sortObj },
      { $skip: skip > 0 ? skip : 0 },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brand",
          as: "productsList",
        },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "productsList._id",
          foreignField: "product",
          as: "variantsList",
        },
      },
      {
        $addFields: {
          products: { $size: "$productsList" },
          stock: { $sum: "$variantsList.stock" },
        },
      },
      {
        $project: {
          productsList: 0,
          variantsList: 0,
        },
      },
    ]);
    return brands;
  }

  public static async getBrandsCount(filters: Record<string, string>) {
    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    const count = await BrandsModel.countDocuments(query);
    return count;
  }

  public static async updateBrand(
    brandId: string,
    brandData: Partial<BrandCreationDto>,
  ) {
    const brand = await BrandsModel.findByIdAndUpdate(brandId, brandData, {
      new: true,
      runValidators: true,
    });
    if (!brand) throw new AppError(404, "BRAND_NOT_FOUND");
    return brand;
  }

  public static async deleteBrand(brandId: string) {
    const brand = await BrandsModel.findByIdAndDelete(brandId);
    if (!brand) throw new AppError(404, "BRAND_NOT_FOUND");
    return brand;
  }

  public static async deleteManyBrands(brandIds: string[]) {
    const result = await BrandsModel.deleteMany({ _id: { $in: brandIds } });
    return result;
  }

  public static async activateBrand(brandId: string) {
    const brand = await BrandsModel.findByIdAndUpdate(
      brandId,
      { status: "ACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!brand) throw new AppError(404, "BRAND_NOT_FOUND");
    return brand;
  }

  public static async deactivateBrand(brandId: string) {
    const brand = await BrandsModel.findByIdAndUpdate(
      brandId,
      { status: "INACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!brand) throw new AppError(404, "BRAND_NOT_FOUND");
    return brand;
  }

  public static async getBrandsNames() {
    const brands = await BrandsModel.find({ status: "ACTIVE" }).select(
      "id nameAr nameEn imageUrl",
    );
    return brands;
  }
}
