import axios from "axios";
import { AppError } from "./error.js";

interface PaymobItem {
  name: string;
  amount: number;
  description: string;
  quantity: number;
}

interface PaymobBillingData {
  apartment?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  building?: string;
  phone_number?: string;
  city?: string;
  country?: string;
  email: string;
  floor?: string;
  state?: string;
}

export interface PaymobIntentionRequest {
  amount: number;
  currency?: string;
  payment_methods?: number[];
  items: PaymobItem[];
  billing_data: PaymobBillingData;
  extras?: Record<string, unknown>;
  special_reference?: string;
  expiration?: number;
  notification_url?: string;
  redirection_url?: string;
}

export async function createIntention(options: PaymobIntentionRequest) {
  try {
    const finalOptions = {
      ...options,
      currency: "EGP",
      payment_methods: [+process.env.PAYMOB_INTEGRATION_ID!],
    };
    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      finalOptions,
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err: any) {
    throw new AppError(400, JSON.stringify(err.response.data));
  }
}

// ─── Webhook / Callback Types ────────────────────────────────────────────────

interface PaymobMerchant {
  id: number;
  created_at: string;
  phones: string[];
  company_emails: string[];
  company_name: string;
  state: string;
  country: string;
  city: string;
  postal_code: string;
  street: string;
}

interface PaymobShippingData {
  id: number;
  first_name: string;
  last_name: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone_number: string;
  postal_code: string;
  extra_description: string;
  shipping_method: string;
  order_id: number;
  order: number;
}

interface PaymobCallbackOrder {
  id: number;
  special_reference: any;

  created_at: string;
  delivery_needed: boolean;
  merchant: PaymobMerchant;
  collector: null | unknown;
  amount_cents: number;
  shipping_data: PaymobShippingData;
  currency: string;
  is_payment_locked: boolean;
  is_return: boolean;
  is_cancel: boolean;
  is_returned: boolean;
  is_canceled: boolean;
  merchant_order_id: string | null;
  wallet_notification: null | unknown;
  paid_amount_cents: number;
  notify_user_with_email: boolean;
  items: unknown[];
  order_url: string;
  commission_fees: number | null;
  delivery_fees_cents: number | null;
  delivery_vat_cents: number | null;
  payment_method: string;
  merchant_staff_tag: string | null;
  api_source: string;
  data: Record<string, unknown>;
}

interface PaymobSourceData {
  pan: string;
  type: string;
  tenure: string | null;
  sub_type: string;
}

interface PaymobMigsOrder {
  acceptPartialAmount: boolean;
  amount: number;
  authenticationStatus: string;
  chargeback: {
    amount: number | null;
    currency: string;
  };
  creationTime: string;
  currency: string;
  description: string;
  id: string;
  lastUpdatedTime: string;
  merchantAmount: number;
  merchantCategoryCode: string;
  merchantCurrency: string;
  status: string;
  totalAuthorizedAmount: number;
  totalCapturedAmount: number;
  special_reference: string | number;
  totalRefundedAmount: number | null;
}

interface PaymobMigsAcquirer {
  batch: number;
  date: string;
  id: string;
  merchantId: string;
  settlementDate: string;
  timeZone: string;
  transactionId: string;
}

interface PaymobMigsTransaction {
  acquirer: PaymobMigsAcquirer;
  amount: number;
  authenticationStatus: string;
  authorizationCode: string;
  currency: string;
  id: string;
  receipt: string;
  source: string;
  stan: string;
  terminal: string;
  type: string;
}

interface PaymobTransactionData {
  gateway_integration_pk: number;
  klass: string;
  created_at: string;
  amount: number;
  currency: string;
  migs_order: PaymobMigsOrder;
  merchant: string;
  migs_result: string;
  migs_transaction: PaymobMigsTransaction;
  txn_response_code: string;
  acq_response_code: string;
  message: string;
  merchant_txn_ref: string;
  order_info: string;
  receipt_no: string;
  transaction_no: string;
  batch_no: number;
  authorize_id: string;
  card_type: string;
  card_num: string;
  secure_hash: string;
  avs_result_code: string;
  avs_acq_response_code: string;
  captured_amount: number;
  authorised_amount: number;
  refunded_amount: number | null;
  acs_eci: string;
}

interface PaymobPaymentKeyClaims {
  extra: Record<string, unknown>;
  user_id: number;
  currency: string;
  order_id: number;
  amount_cents: number;
  billing_data: PaymobBillingData & {
    postal_code?: string;
    extra_description?: string;
  };
  redirect_url: string;
  integration_id: number;
  lock_order_when_paid: boolean;
  next_payment_intention: string;
  single_payment_attempt: boolean;
}

export interface PaymobTransactionObject {
  id: number;
  pending: boolean;
  amount_cents: number;
  success: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  is_refunded: boolean;
  is_3d_secure: boolean;
  integration_id: number;
  profile_id: number;
  has_parent_transaction: boolean;
  order: PaymobCallbackOrder;
  created_at: string;
  transaction_processed_callback_responses: unknown[];
  currency: string;
  source_data: PaymobSourceData;
  api_source: string;
  terminal_id: string | null;
  merchant_commission: number | null;
  installment: unknown | null;
  discount_details: unknown[];
  is_void: boolean;
  is_refund: boolean;
  data: PaymobTransactionData;
  is_hidden: boolean;
  payment_key_claims: PaymobPaymentKeyClaims;
  error_occured: boolean;
  is_live: boolean;
  other_endpoint_reference: string | null;
  refunded_amount_cents: number | null;
  source_id: number;
  is_captured: boolean;
  captured_amount: number | null;
  merchant_staff_tag: string | null;
  updated_at: string;
  is_settled: boolean;
  bill_balanced: boolean;
  is_bill: boolean;
  owner: number;
  parent_transaction: unknown | null;
}

export interface PaymobTransaction {
  type: "TRANSACTION" | string;
  obj: PaymobTransactionObject;
  accept_fees: 0;
  issuer_bank: string | null;
  transaction_processed_callback_responses: string[];
}

export interface PaymobTransactionCallback {
  type: "TRANSACTION" | string;
  obj: PaymobTransactionObject;
  issuer_bank: string | null;
  transaction_processed_callback_responses: string;
}
