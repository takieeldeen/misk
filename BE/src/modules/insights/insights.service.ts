import OrdersModel from "../../database/models/orders.model.js";
import UserModel from "../../database/models/user.model.js";
import OrderItemModel from "../orderItems/orderItems.model.js";
import PaymentModel from "../payments/payments.model.js";
import ProductVariantModel from "../variants/variants.model.js";

export class InsightsService {
  public static async getOverview() {
    const [revenue] = await PaymentModel.aggregate([
      {
        $match: {
          status: "PAID",
        },
      },
      {
        $facet: {
          today: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$paidAmountInCents" },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
              },
            },
          ],
          thisWeek: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$paidAmountInCents" },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$paidAmountInCents" },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
              },
            },
          ],
        },
      },

      {
        $project: {
          today: { $arrayElemAt: ["$today.totalRevenue", 0] },
          thisWeek: { $arrayElemAt: ["$thisWeek.totalRevenue", 0] },
          thisMonth: { $arrayElemAt: ["$thisMonth.totalRevenue", 0] },
        },
      },
      {
        $project: {
          today: { $ifNull: ["$today", 0] },
          thisWeek: { $ifNull: ["$thisWeek", 0] },
          thisMonth: { $ifNull: ["$thisMonth", 0] },
        },
      },
    ]);
    const [orders] = await OrdersModel.aggregate([
      {
        $match: { status: { $in: ["PAID", "DELIVERED", "SHIPPED"] } },
      },
      {
        $facet: {
          today: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrders: 1,
              },
            },
          ],
          thisWeek: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrders: 1,
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrders: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          today: { $arrayElemAt: ["$today", 0] },
          thisWeek: { $arrayElemAt: ["$thisWeek", 0] },
          thisMonth: { $arrayElemAt: ["$thisMonth", 0] },
        },
      },
      {
        $project: {
          today: { $ifNull: ["$today", 0] },
          thisWeek: { $ifNull: ["$thisWeek.totalOrders", 0] },
          thisMonth: { $ifNull: ["$thisMonth.totalOrders", 0] },
        },
      },
    ]);

    const [customers] = await UserModel.aggregate([
      // {
      //   $match: { isAdmin: false },
      // },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalCustomers: { $sum: 1 },
              },
            },
          ],
          newThisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                newThisMonth: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                newThisMonth: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ["$total.totalCustomers", 0] },
          newThisMonth: { $arrayElemAt: ["$newThisMonth.newThisMonth", 0] },
        },
      },
      {
        $project: {
          total: { $ifNull: ["$total", 0] },
          newThisMonth: { $ifNull: ["$newThisMonth", 0] },
        },
      },
    ]);
    const averageOrderValue =
      (revenue?.thisMonth || 0) / (orders?.thisMonth || 0);

    return {
      revenue: revenue || { today: 0, thisWeek: 0, thisMonth: 0 },
      orders: orders || { today: 0, thisWeek: 0, thisMonth: 0 },
      customers: customers || { total: 0, newThisMonth: 0 },
      avgOrderValue: averageOrderValue ? +averageOrderValue.toFixed(2) : 0,
    };
  }

  public static async getRevenueAnalytics(range: "7d" | "30d" | "12m" = "30d") {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    let format = "%Y-%m-%d";

    if (range === "7d") {
      startDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      format = "%Y-%m-%d";
    } else if (range === "30d") {
      startDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      format = "%Y-%m-%d";
    } else if (range === "12m") {
      startDate.setMonth(startDate.getMonth() - 12);
      format = "%B %Y";
    }
    const revenue = await PaymentModel.aggregate([
      {
        $match: {
          status: "PAID",
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $densify: {
          field: "createdAt",
          range: {
            step: 1,
            unit: range === "12m" ? "month" : "day",
            bounds: [startDate, endDate],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: format,
            },
          },
          totalRevenue: {
            $sum: "$paidAmountInCents",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
        },
      },
    ]);
    return revenue;
  }

  public static async getOrdersAnalytics(range: "7d" | "30d" | "12m" = "30d") {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    let format = "%Y-%m-%d";

    switch (range) {
      case "7d":
        startDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        format = "%Y-%m-%d";
        break;
      case "30d":
        startDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        format = "%Y-%m-%d";
        break;
      case "12m":
        startDate.setMonth(startDate.getMonth() - 12);
        format = "%B %Y";
        break;
    }
    const orders = await OrdersModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
          pending: [
            {
              $match: {
                status: "PENDING",
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
          paid: [
            {
              $match: {
                status: "PAID",
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
          cancelled: [
            {
              $match: {
                status: "CANCELLED",
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
          delivered: [
            {
              $match: {
                status: "DELIVERED",
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ["$total.totalOrders", 0] },
          pending: { $arrayElemAt: ["$pending.totalOrders", 0] },
          paid: { $arrayElemAt: ["$paid.totalOrders", 0] },
          cancelled: { $arrayElemAt: ["$cancelled", 0] },
          delivered: { $arrayElemAt: ["$delivered", 0] },
        },
      },
      {
        $project: {
          total: { $ifNull: ["$total", 0] },
          pending: { $ifNull: ["$pending", 0] },
          paid: { $ifNull: ["$paid", 0] },
          cancelled: { $ifNull: ["$cancelled", 0] },
          delivered: { $ifNull: ["$delivered", 0] },
        },
      },
    ]);
    return orders;
  }

  public static async getTopSellingProducts() {
    const topSellingProducts = await OrderItemModel.aggregate([
      {
        $group: {
          _id: "$variant",
          count: { $sum: "$quantity" },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          localField: "_id",
          foreignField: "_id",
          as: "variant",
          from: "productvariants",
          pipeline: [
            {
              $lookup: {
                localField: "product",
                foreignField: "_id",
                as: "product",
                from: "products",
              },
            },
            {
              $unwind: "$product",
            },
          ],
        },
      },
      {
        $unwind: "$variant",
      },
    ]);
    return topSellingProducts;
  }

  public static async getInventoryAlerts() {
    const [inventroyAlerts] = await ProductVariantModel.aggregate([
      {
        $facet: {
          lowStock: [
            {
              $match: {
                stock: {
                  $lte: 10,
                  $gt: 0,
                },
              },
            },
            {
              $lookup: {
                localField: "product",
                foreignField: "_id",
                as: "product",
                from: "products",
              },
            },
            {
              $unwind: "$product",
            },
          ],
          outOfStock: [
            {
              $match: {
                stock: {
                  $eq: 0,
                },
              },
            },
            {
              $lookup: {
                localField: "product",
                foreignField: "_id",
                as: "product",
                from: "products",
              },
            },
            {
              $unwind: "$product",
            },
          ],
        },
      },
    ]);

    return inventroyAlerts;
  }

  public static async getCustomerAnalytics() {
    const [users] = await UserModel.aggregate([
      {
        $match: {
          isAdmin: { $ne: true },
        },
      },
      {
        $facet: {
          totalCustomers: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          newCustomers: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCustomers: {
            $arrayElemAt: ["$totalCustomers.count", 0],
          },
          newCustomers: {
            $arrayElemAt: ["$newCustomers.count", 0],
          },
        },
      },
      {
        $project: {
          totalCustomers: { $ifNull: ["$totalCustomers", 0] },
          newCustomers: { $ifNull: ["$newCustomers", 0] },
        },
      },
    ]);

    const [returningCustomers] = await OrdersModel.aggregate([
      {
        $match: {
          status: "PAID",
        },
      },
      {
        $lookup: {
          localField: "user",
          foreignField: "_id",
          as: "user",
          from: "users",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.isAdmin": { $ne: true },
        },
      },
      {
        $group: {
          _id: "$user._id",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $count: "returningCustomers",
      },
    ]);
    return { ...users, ...returningCustomers };
  }

  public static async getPaymentsInsights() {
    const [payments] = await OrdersModel.aggregate([
      {
        $facet: {
          failedPayments: [
            {
              $match: {
                status: "FAILED",
              },
            },
          ],
        },
      },
    ]);
    return payments;
  }
}
