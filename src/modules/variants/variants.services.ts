import { AppError } from "../../utilities/utilis/error.js";
import ProductVariantModel from "./variants.model.js";
import { CreateProductVariant } from "./variants.type.js";

export class VariantServices {
  public static async createVariant(variantData: CreateProductVariant) {
    const newVariant = await ProductVariantModel.create(variantData);
    return newVariant;
  }

  public static async getOneVariant(variantId: string) {
    const variant =
      await ProductVariantModel.findById(variantId).populate("product");
    if (!variant) throw new AppError(404, "VARIANT_NOT_FOUND");
    return variant;
  }

  public static async getPaginatedVariants(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, any>,
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.product) {
      query.product = filters.product;
    }

    if (filters.sku) {
      query.sku = { $regex: filters.sku, $options: "i" };
    }

    const variants = await ProductVariantModel.find(query)
      .populate("product")
      .skip(skip > 0 ? skip : 0)
      .limit(limit)
      .sort({ createdAt: -1 });
    return variants;
  }

  public static async getVariantsCount(filters: Record<string, any>) {
    const query: any = {
      status: filters.status ? filters.status : { $in: ["ACTIVE", "INACTIVE"] },
    };

    if (filters.product) {
      query.product = filters.product;
    }

    if (filters.sku) {
      query.sku = { $regex: filters.sku, $options: "i" };
    }

    const count = await ProductVariantModel.countDocuments(query);
    return count;
  }

  public static async updateVariant(
    variantId: string,
    variantData: Partial<CreateProductVariant>,
  ) {
    console.log(variantId);
    const variant = await ProductVariantModel.findByIdAndUpdate(
      variantId,
      variantData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!variant) throw new AppError(404, "VARIANT_NOT_FOUND");
    return variant;
  }

  public static async deleteVariant(variantId: string) {
    const variant = await ProductVariantModel.findByIdAndDelete(variantId);
    if (!variant) throw new AppError(404, "VARIANT_NOT_FOUND");
    return variant;
  }

  public static async activateVariant(variantId: string) {
    const variant = await ProductVariantModel.findByIdAndUpdate(
      variantId,
      { status: "ACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!variant) throw new AppError(404, "VARIANT_NOT_FOUND");
    return variant;
  }

  public static async deactivateVariant(variantId: string) {
    const variant = await ProductVariantModel.findByIdAndUpdate(
      variantId,
      { status: "INACTIVE" },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!variant) throw new AppError(404, "VARIANT_NOT_FOUND");
    return variant;
  }
}
