import OrdersModel from "../../database/models/orders.model.js";
import UserModel from "../../database/models/user.model.js";
import PaymentModel from "../payments/payments.model.js";

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
    // Example Respons
    /*
    {
      total: 1200,
      statusBreakdown:{
        pending: 200,
        paid: 30
        shipped: 10,
        cancelled: 100,
        delivered: 800
      }
    }
    */
   await OrdersModel.aggregate([
    {
      $match: {
        $createdAt: {
          $g
        }
      }
    }
   ])
  }
}
