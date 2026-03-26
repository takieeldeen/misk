import { AppError } from "../../utilities/utilis/error.js";
import ProductModel from "./products.model.js";
import { ProductCreationDto } from "./products.types.js";

export class ProductsServices {
  public static async createProduct(productData: ProductCreationDto) {
    const newProduct = await ProductModel.create(productData);
    return newProduct;
  }

  public static async getOneProduct(productId: string) {
    const product = await ProductModel.findById(productId)
      .populate("category")
      .populate("brand");
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  public static async getPaginatedProducts(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string>,
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

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.gender) {
      query.gender = filters.gender;
    }

    const products = await ProductModel.find(query)
      .skip(skip > 0 ? skip : 0)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("brand");
    return products;
  }

  public static async getProductsCount(filters: Record<string, string>) {
    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.name) {
      query.$or = [
        { nameAr: { $regex: filters.name, $options: "i" } },
        { nameEn: { $regex: filters.name, $options: "i" } },
      ];
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.gender) {
      query.gender = filters.gender;
    }

    const count = await ProductModel.countDocuments(query);
    return count;
  }

  public static async updateProduct(
    productId: string,
    productData: Partial<ProductCreationDto>,
  ) {
    const product = await ProductModel.findByIdAndUpdate(productId, productData, {
      new: true,
      runValidators: true,
    });
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
