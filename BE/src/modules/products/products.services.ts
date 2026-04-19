import { AppError } from "../../utilities/utilis/error.js";
import ProductModel from "../../database/models/products.model.js";
import { ProductCreationDto } from "./products.types.js";
import { Types } from "mongoose";

export class ProductsServices {
  public static async createProduct(productData: ProductCreationDto) {
    const newProduct = await ProductModel.create(productData);
    return newProduct;
  }

  public static async getOneProduct(productId: string) {
    // const product = await ProductModel.findById(productId)
    //   .populate("category")
    //   .populate("brand");
    const [product] = await ProductModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 1,
                nameAr: 1,
                nameEn: 1,
                imageUrl: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
          pipeline: [
            {
              $project: {
                _id: 1,
                nameAr: 1,
                nameEn: 1,
                imageUrl: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
          pipeline: [
            {
              $addFields: {
                stockStatus: {
                  $switch: {
                    branches: [
                      {
                        case: { $lte: ["$stock", 0] },
                        then: "OUT_OF_STOCK",
                      },
                      {
                        case: { $lt: ["$stock", 10] },
                        then: "LOW_STOCK",
                      },
                    ],
                    default: "IN_STOCK",
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                sizeMl: 1,
                price: 1,
                stock: 1,
                status: 1,
                stockStatus: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
          pipeline: [
            {
              $group: {
                _id: "$product",
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                avgRating: 1,
              },
            },
          ],
        },
      },

      {
        $addFields: {
          reviews: {
            $cond: {
              if: { $eq: [{ $size: "$reviews" }, 0] },
              then: {
                count: 0,
                avgRating: 0,
              },
              else: { $arrayElemAt: ["$reviews", 0] },
            },
          },
        },
      },
    ]);
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  public static async getPaginatedProducts(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string>,
    locale: "ar" | "en" = "en",
  ) {
    const skip = (page - 1) * limit;
    const finalLocale = `${locale[0].toUpperCase()}${locale.slice(1).toLowerCase()}`;
    const query: any = {};
    const sortObj: any = {};
    if (filters.status) {
      query.status = {
        $in: filters.status.split(","),
      };
    }

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    if (filters.category) {
      query.category = {
        $in: filters.category.split(",").map((el) => new Types.ObjectId(el)),
      };
    }

    if (filters.brand) {
      query.brand = {
        $in: filters.brand.split(",").map((el) => new Types.ObjectId(el)),
      };
    }

    if (filters.gender) {
      query.gender = { $in: filters.gender.split(",") };
    }

    if (filters.sort) {
      const sortBy = filters?.sort?.[0] === "-" ? -1 : 1;
      let sortField = filters.sort.startsWith("-")
        ? filters.sort.slice(1).toLowerCase()
        : filters.sort.toLowerCase();
      sortField = sortField === "name" ? "name" + finalLocale : sortField;
      sortObj[sortField] = sortBy;
    } else {
      sortObj.createdAt = -1;
    }
    const products = await ProductModel.aggregate([
      {
        $match: query,
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 1,
                nameAr: 1,
                nameEn: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
          pipeline: [
            {
              $project: {
                _id: 1,
                nameAr: 1,
                nameEn: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "stock",
          pipeline: [
            {
              $group: {
                _id: "$product",
                count: { $sum: "$stock" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
              },
            },
          ],
        },
      },
      {
        $unwind: { path: "$stock", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          quantity: { $ifNull: ["$stock.count", 0] },
          minPrice: { $ifNull: ["$stock.minPrice", 0] },
          maxPrice: { $ifNull: ["$stock.maxPrice", 0] },
          price: { $avg: ["$stock.minPrice", "$stock.maxPrice"] },
        },
      },
      {
        $sort: sortObj,
      },
      {
        $skip: skip > 0 ? skip : 0,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          stock: 0,
          price: 0,
        },
      },
    ]);

    return products;
  }

  public static async getProductsCount(filters: Record<string, string>) {
    const query: any = {};

    if (filters.status) {
      query.status = {
        $in: filters.status.split(","),
      };
    }

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    if (filters.category) {
      query.category = {
        $in: filters.category.split(",").map((el) => new Types.ObjectId(el)),
      };
    }

    if (filters.brand) {
      query.brand = {
        $in: filters.brand.split(",").map((el) => new Types.ObjectId(el)),
      };
    }

    if (filters.gender) {
      query.gender = { $in: filters.gender.split(",") };
    }

    const count = await ProductModel.countDocuments(query);
    return count;
  }

  public static async updateProduct(
    productId: string,
    productData: Partial<ProductCreationDto>,
  ) {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  public static async deleteProduct(productId: string) {
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  public static async activateProduct(productId: string) {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { status: "ACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  public static async deactivateProduct(productId: string) {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { status: "INACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }
}
