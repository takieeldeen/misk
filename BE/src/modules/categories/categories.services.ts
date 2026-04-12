import { AppError } from "../../utilities/utilis/error.js";
import CategoriesModel from "../../database/models/categories.model.js";
import { CategoryCreationDto } from "./categories.type.js";

export class CategoriesServices {
  public static async createCategory(categoryData: CategoryCreationDto) {
    const newCategory = await CategoriesModel.create(categoryData);
    return newCategory;
  }

  public static async getOneCategory(categoryId: string) {
    const category = await CategoriesModel.findById(categoryId);
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  }

  public static async getPaginatedCategories(
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

    const categories = await CategoriesModel.aggregate([
      { $match: query },
      { $sort: sortObj },
      { $skip: skip > 0 ? skip : 0 },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
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
    return categories;
  }

  public static async getCategoriesCount(filters: Record<string, string>) {
    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    const count = await CategoriesModel.countDocuments(query);
    return count;
  }

  public static async updateCategory(
    categoryId: string,
    categoryData: Partial<CategoryCreationDto>,
  ) {
    const category = await CategoriesModel.findByIdAndUpdate(
      categoryId,
      categoryData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  }

  public static async deleteCategory(categoryId: string) {
    const category = await CategoriesModel.findByIdAndDelete(categoryId);
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  }

  public static async activateCategory(categoryId: string) {
    const category = await CategoriesModel.findByIdAndUpdate(
      categoryId,
      { status: "ACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  }

  public static async deactivateCategory(categoryId: string) {
    const category = await CategoriesModel.findByIdAndUpdate(
      categoryId,
      { status: "INACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!category) throw new AppError(404, "CATEGORY_NOT_FOUND");
    return category;
  }

  public static async getCategoriesNames() {
    const categories = await CategoriesModel.find({ status: "ACTIVE" }).select(
      "id nameAr nameEn imageUrl",
    );
    return categories;
  }
}
