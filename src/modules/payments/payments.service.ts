import CartItemModel from "../../database/models/cart-items.model.js";
import CartModel from "../../database/models/cart.model.js";
import OrdersModel from "../../database/models/orders.model.js";
import { AppError } from "../../utilities/utilis/error.js";
import { createIntention } from "../../utilities/utilis/paymob.js";
import OrderItemModel from "../orderItems/orderItems.model.js";
import { OrderItemType } from "../orderItems/orderItems.type.js";
import { OrderType } from "../orders/orders.types.js";
import { ProductType } from "../products/products.types.js";
import { UserType } from "../users/user.types.js";
import { ProductVariant } from "../variants/variants.type.js";
import PaymentModel from "./payments.model.js";
import { PaymentType } from "./payments.types.js";
import crypto from "crypto";

export class PaymentService {
  public static async createPayment(orderId: string) {
    const order = await OrdersModel.findOne({
      _id: orderId,
      status: "PENDING",
    }).populate("user");
    if (!order) throw new AppError(404, "ORDER_NOT_FOUND");
    const orderItems = await OrderItemModel.find({ order: orderId }).populate({
      path: "variant",
      populate: {
        path: "product",
      },
    });
    if (orderItems.length === 0)
      throw new AppError(404, "ORDER_ITEMS_NOT_FOUND");

    const newPayment: Partial<PaymentType> = {
      order: orderId,
      user: order.user,
      gateOrderId: crypto.randomUUID(),
      transactionId: crypto.randomUUID(),
      amountInCents: order.amountInCents,
      currency: "EGP",
      status: "PENDING",
      paymentMethod: "CARD",
      paymentKey: "",
      rawCallbackData: {},
    };
    const payment = await PaymentModel.create(newPayment);
    // Create new Intention
    const intention = await this.createPaymentIntention(
      order,
      orderItems,
      payment,
    );
    payment.gateOrderId = intention.id;
    await payment.save();
    const redirectionUrl = this.generateCallbackUrl(intention);
    return { payment, redirectionUrl };
  }

  private static async createPaymentIntention(
    order: OrderType,
    orderItems: OrderItemType[],
    payment: PaymentType,
  ) {
    const intention = await createIntention({
      amount: order.amountInCents,
      currency: "EGP",
      payment_methods: [+process.env.PAYMOB_INTEGRATION_ID!],
      items: orderItems.map((item) => {
        const product = (item.variant as ProductVariant).product as ProductType;
        const variant = item.variant as ProductVariant;
        const itemName = `${product.nameEn || product.nameAr} (${variant.sizeMl}ml)`;
        return {
          name: itemName,
          amount: item.unitPriceInCents,
          description:
            product.descriptionEn || product.descriptionAr || itemName,
          quantity: item.quantity,
          image: product.images?.[0],
        };
      }),
      billing_data: {
        email: (order.user as UserType).email,
        first_name: (order.user as UserType).name,
        last_name: "--",
        phone_number: (order.user as UserType).phone,
        city: (order.user as UserType).addresses?.[0]?.city,
        country: (order.user as UserType).addresses?.[0]?.country,
        street: (order.user as UserType).addresses?.[0]?.address_line_1,
        building: (order.user as UserType).addresses?.[0]?.building_number,
        floor: (order.user as UserType).addresses?.[0]?.floor,
        apartment: (order.user as UserType).addresses?.[0]?.apartment,
        state: (order.user as UserType).addresses?.[0]?.area,
      },
      extras: {
        order_id: order._id.toString(),
      },
      special_reference: payment._id.toString(),
      expiration: 900,
      notification_url: `${process.env.API_URL}/api/v1/payments/webhook`,
      // notification_url: `https://hooks.paymob.com/51e48c59-8e2a-49a0-93e6-0c3d0896f28b`,
      redirection_url: `${process.env.CLIENT_URL}/api/v1/payments/success`,
    });
    return intention;
  }

  public static async handleWebhook(data: any, hmac: string) {
    const paymentStatus = data?.obj?.order?.payment_status;
    // TODO: update order items status
    if (paymentStatus === "PAID" && !this.verifyHmac(data, hmac)) {
      throw new AppError(400, "INVALID_HMAC");
    }
    const payment = await PaymentModel.findByIdAndUpdate(
      data?.obj?.order?.merchant_order_id,
      {
        status: paymentStatus,
        transactionId: data?.obj?.id,
        paidAmountInCents: data?.obj?.amount_cents,
        currency: data?.obj?.data?.currency,
        paymentMethod: data?.obj?.source_data?.type,
        cardType: data?.obj?.source_data?.sub_type,
        cardNumber: data?.obj?.data?.card_num,
      },
    );
    // TODO: update order status
    const orderStatus = paymentStatus === "PAID" ? "PAID" : "FAILED";
    await OrdersModel.findByIdAndUpdate(payment?.order, {
      status: orderStatus,
      paymentMethod: data?.obj?.source_data?.type,
    });
    if (paymentStatus === "PAID") {
      await OrderItemModel.updateMany(
        { order: payment?.order },
        {
          reservedStock: 0,
        },
      );
    }

    // Clear Cart if successfull order
    if (paymentStatus === "PAID") {
      const cart = await CartModel.findOne({ user: payment?.user });
      await CartItemModel.deleteMany({ cart: cart?._id });
    }
  }

  private static generateCallbackUrl(intention: any): string {
    const redirectionUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${intention?.client_secret}`;
    return redirectionUrl;
  }

  private static verifyHmac(webhookData: any, sentHmac: string) {
    const hmacValues = [
      webhookData?.obj?.amount_cents,
      webhookData?.obj?.created_at,
      webhookData?.obj?.currency,
      webhookData?.obj?.error_occured,
      webhookData?.obj?.has_parent_transaction,
      webhookData?.obj?.id,
      webhookData?.obj?.integration_id,
      webhookData?.obj?.is_3d_secure,
      webhookData?.obj?.is_auth,
      webhookData?.obj?.is_capture,
      webhookData?.obj?.is_refunded,
      webhookData?.obj?.is_standalone_payment,
      webhookData?.obj?.is_voided,
      webhookData?.obj?.payment_key_claims?.order_id,
      webhookData?.obj?.owner,
      webhookData?.obj?.pending,
      webhookData?.obj?.source_data?.pan,
      webhookData?.obj?.source_data?.sub_type,
      webhookData?.obj?.source_data?.type,
      webhookData?.obj?.success,
    ];
    const concatenatedString = hmacValues.join("");
    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
      .update(concatenatedString)
      .digest("hex");
    return calculatedHmac === sentHmac;
  }

  public static async getPaginatedPayments(
    page: number = 1,
    limit: number = 9,
    filters: Record<string, string> = {},
  ) {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.user) query.user = filters.user;
    const payments = await PaymentModel.find(query)
      .skip(skip > 0 ? skip : 0)
      .limit(limit)
      .sort({ createdAt: -1 });
    return payments;
  }

  public static async getPaymentsCount(filters: Record<string, string>) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.user) query.user = filters.user;
    const count = await PaymentModel.countDocuments(query);
    return count;
  }

  public static async getOnePayment(paymentId: string) {
    const payment = await PaymentModel.findById(paymentId)
      .populate("user")
      .populate("order");

    const orderItems = await OrderItemModel.find({
      order: payment?.order,
    }).populate({
      path: "variant",
      populate: {
        path: "product",
      },
    });
    const order = (payment?.order as any)?._doc;
    const finalOrder = {
      ...order,
      items: orderItems,
    };
    return { ...(payment as any)._doc, order: finalOrder };
  }
}
