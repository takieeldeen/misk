import OrdersModel from "../../database/models/orders.model.js";
import UserModel from "../../database/models/user.model.js";
import catchAsync from "../../utilities/utilis/catchAsync.js";
import PaymentModel from "../payments/payments.model.js";

export const getOverviewHandler = catchAsync(async (req, res, next) => {
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
        today: { $arrayElemAt: ["$today.totalOrders", 0] },
        thisWeek: { $arrayElemAt: ["$thisWeek.totalOrders", 0] },
        thisMonth: { $arrayElemAt: ["$thisMonth.totalOrders", 0] },
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
  ]);
  const averageOrderValue =
    (revenue?.thisMonth || 0) / (orders?.thisMonth || 0);
  res.status(200).json({
    status: "success",
    data: {
      revenue: revenue || { today: 0, thisWeek: 0, thisMonth: 0 },
      orders: orders || { today: 0, thisWeek: 0, thisMonth: 0 },
      customers: customers || { total: 0, newThisMonth: 0 },
      avgOrderValue: averageOrderValue ? +averageOrderValue.toFixed(2) : 0,
    },
  });
});
