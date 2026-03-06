"use client";

import { SubscriptionPlan } from "@/services/auth/types/auth.types";
import { PlanCard } from "./PlanCard";

interface PlansSectionProps {
  subscriptions: SubscriptionPlan[];
  billingCycle: "MONTHLY" | "YEARLY";
  setBillingCycle: (cycle: "MONTHLY" | "YEARLY") => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const PlansSection = ({
  subscriptions,
  billingCycle,
  setBillingCycle,
  onSelectPlan,
}: PlansSectionProps) => {
  return (
    <div className="animate-in space-y-4 fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="py-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Select the dashboard configuration that fits your operational scale.
          Upgrade, downgrade, or cancel anytime.
        </p>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex border border-gray-200 bg-white p-1 rounded-full shadow-sm">
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              className={`px-6 py-2.5 text-sm cursor-pointer font-semibold rounded-full transition-all ${
                billingCycle === "MONTHLY"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Billing Monthly
            </button>
            <button
              onClick={() => setBillingCycle("YEARLY")}
              className={`px-6 py-2.5 text-sm font-semibold cursor-pointer rounded-full transition-all flex items-center gap-2 ${
                billingCycle === "YEARLY"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Billing Annually
              <span
                className={`px-2 py-0.5 text-[10px] rounded-md uppercase tracking-wider ${
                  billingCycle === "YEARLY"
                    ? "bg-white/20 text-white"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full p-4 space-y-4">
        {subscriptions.map((plan) => (
          <PlanCard
            key={plan._id}
            plan={plan}
            billingCycle={billingCycle}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
};
