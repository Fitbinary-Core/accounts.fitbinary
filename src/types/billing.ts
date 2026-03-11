export interface Feature {
  code: string;
  type: string;
  value: boolean | string | number;
  _id: string;
}

export interface Plan {
  _id: string;
  name: string;
  features: Feature[];
}

export interface App {
  _id: string;
  name: string;
}

export interface Organization {
  _id: string;
  business_name: string;
  business_email: string;
}

export interface Subscription {
  _id: string;
  organization: Organization;
  app: App;
  plan: Plan;
  status: "ACTIVE" | "TRIAL" | "CANCELED" | "EXPIRED" | "PAST_DUE" | string;
  trialStart: string | null;
  trialEnd: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  graceUntil: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  cancelReason: string | null;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY" | string;
  unitAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  provider: string;
  providerRefId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  latestInvoiceId: string | null;
  latestPaymentIntentId: string | null;
  lastWebhookEventId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscriptionResponse {
  message: string;
  subscriptions: Subscription[];
}
