"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { CreditCard, Receipt, Building2, Calendar, ShieldCheck, Clock, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationSubscriptions } from "@/services/billing/billing.service";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Loader2 } from "lucide-react";
import { formatDateTime } from "@/utils/utils";

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["organization-subscriptions"],
    queryFn: getOrganizationSubscriptions,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Syncing Financial Records...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const subscriptions = data?.subscriptions || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Billing & Subscriptions"
          description="Manage your active plans, payment methods, and see your billing history."
        />

        <div className="grid gap-8">
          {/* Active Subscriptions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck className="size-4 text-zinc-900" />
              <h2 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.2em]">
                My Subscriptions
              </h2>
            </div>

            {subscriptions.length === 0 ? (
              <div className="py-20 border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50 flex flex-col items-center justify-center text-center px-4">
                <div className="size-12 rounded-sm bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                  <Zap className="text-zinc-300" size={24} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">No Active Plans</h3>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-xs font-bold uppercase tracking-widest">
                  You don't have any active subscriptions yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subscriptions.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col hover:border-zinc-400 transition-all group relative"
                  >
                    {/* Header: App and Organization */}
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-zinc-900 rounded-sm flex items-center justify-center text-white shadow-sm transition-transform">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                            {sub.app.name}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            {sub.organization.business_name}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-[0.15em] border ${sub.status === 'TRIAL'
                        ? 'bg-zinc-100 text-zinc-900 border-zinc-200'
                        : 'bg-zinc-900 text-white border-zinc-900'
                        }`}>
                        {sub.status}
                      </span>
                    </div>

                    {/* Content: Plan and Billing Details */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1 block">
                            Active Plan
                          </span>
                          <h4 className="text-lg font-black text-zinc-900 tracking-tight">
                            {sub.plan.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1 block">
                            Billing Cycle
                          </span>
                          <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                            {sub.billingCycle}
                          </span>
                        </div>
                      </div>

                      {/* Timeline/Dates */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Clock size={12} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Started On</span>
                          </div>
                          <span className="text-[10px] text-zinc-900 font-mono font-bold">
                            {new Date(sub.currentPeriodStart).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="flex items-center gap-1.5 text-zinc-400 justify-end">
                            <Calendar size={12} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Expires On</span>
                          </div>
                          <span className="text-[10px] text-zinc-900 font-mono font-bold">
                            {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {sub.plan.features && sub.plan.features.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.2em]">What's Included</span>
                          <div className="flex flex-wrap gap-1.5">
                            {sub.plan.features.map((feature) => (
                              <div
                                key={feature._id}
                                className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded-sm flex items-center gap-1"
                              >
                                <div className="size-1 bg-zinc-900 rounded-full" />
                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                  {feature.code}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Financials */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Amount</span>
                          <span className="text-sm font-black text-zinc-900">
                            {sub.currency} {sub.unitAmount.toFixed(2)}
                          </span>
                        </div>
                        <button className="h-9 px-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-sm active:scale-95">
                          Manage Plan
                        </button>
                      </div>
                    </div>

                    {/* Subtle ID watermark */}
                    <div className="absolute top-2 right-2 text-[6px] text-zinc-200 font-mono rotate-90 origin-right">
                      {sub._id.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
