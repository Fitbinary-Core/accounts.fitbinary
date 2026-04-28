"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import {
  CreditCard,
  Building2,
  Calendar,
  ShieldCheck,
  Clock,
  Zap,
  GitBranch,
  Users,
  BarChart3,
  Package,
  Box,
  LineChart,
  Headphones,
  Check,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationSubscriptions } from "@/services/billing/billing.service";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Loader2 } from "lucide-react";

const FEATURE_CONFIG: Record<
  string,
  { label: string; icon: any; format: (val: any) => string }
> = {
  MULTI_BRANCH_SUPPORT: { label: "Multi-Branch Support", icon: GitBranch, format: () => "Included" },
  MAX_BRANCHES: { label: "Max Branches", icon: Building2, format: (val) => `${val} ${val === 1 ? "Branch" : "Branches"}` },
  MAX_USERS: { label: "Max Users", icon: Users, format: (val) => `${val} ${val === 1 ? "User" : "Users"}` },
  SALES_REPORTS: { label: "Sales Reports", icon: BarChart3, format: () => "Included" },
  INVENTORY_REPORTS: { label: "Inventory Reports", icon: Package, format: () => "Included" },
  MAX_PRODUCTS: { label: "Max Products", icon: Box, format: (val) => `${val} ${val === 1 ? "Product" : "Products"}` },
  ADVANCE_ANALYSIS: { label: "Advanced Analysis", icon: LineChart, format: () => "Included" },
  ONLINE_SUPPORT: { label: "Online Support", icon: Headphones, format: () => "Included" },
};

function getDaysRemaining(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    TRIAL: "bg-blue-50 text-blue-700 border-blue-200",
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    EXPIRED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${styles[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
      {status}
    </span>
  );
}

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["organization-subscriptions"],
    queryFn: getOrganizationSubscriptions,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading subscriptions...</p>
        </div>
      </DashboardLayout>
    );
  }

  const subscriptions = data?.subscriptions || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DashboardBreadcrumb
          title="Billing & Subscriptions"
          description="View your active plans, billing cycle, and included features."
        />

        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="py-24 border border-dashed border-zinc-200 rounded-lg bg-zinc-50 flex flex-col items-center justify-center text-center px-4">
              <div className="size-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                <CreditCard className="text-zinc-400" size={22} />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">No active subscriptions</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs leading-relaxed">
                You don't have any active plans yet. Contact support to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {subscriptions.map((sub) => {
                const daysLeft = getDaysRemaining(sub.currentPeriodEnd);
                const isExpiringSoon = daysLeft <= 7 && sub.status !== "EXPIRED";

                return (
                  <div
                    key={sub._id}
                    className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-zinc-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 bg-zinc-900 rounded-lg flex items-center justify-center text-white shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-zinc-900 truncate">
                            {sub.app.name}
                          </h3>
                          <p className="text-xs text-zinc-500 truncate">{sub.organization.business_name}</p>
                        </div>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>

                    {/* Plan info */}
                    <div className="p-5 space-y-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-zinc-400 mb-1">Current Plan</p>
                          <h4 className="text-xl font-bold text-zinc-900">{sub.plan.name}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400 mb-1">Amount</p>
                          <p className="text-lg font-bold text-zinc-900">
                            {sub.currency} {sub.unitAmount.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-zinc-400">{sub.billingCycle}</p>
                        </div>
                      </div>

                      {/* Date range */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
                          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                            <Clock size={11} />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Started</span>
                          </div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {new Date(sub.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className={`rounded-lg p-3 border ${isExpiringSoon ? "bg-orange-50 border-orange-200" : "bg-zinc-50 border-zinc-100"}`}>
                          <div className={`flex items-center gap-1.5 mb-1 ${isExpiringSoon ? "text-orange-500" : "text-zinc-400"}`}>
                            {isExpiringSoon ? <AlertCircle size={11} /> : <Calendar size={11} />}
                            <span className="text-[10px] font-medium uppercase tracking-wide">
                              {isExpiringSoon ? `${daysLeft}d left` : "Expires"}
                            </span>
                          </div>
                          <p className={`text-sm font-semibold ${isExpiringSoon ? "text-orange-700" : "text-zinc-900"}`}>
                            {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      {sub.plan.features && sub.plan.features.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-400 mb-2.5 font-medium">What's included</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sub.plan.features.map((feature) => {
                              const config = FEATURE_CONFIG[feature.code];
                              const Icon = config?.icon || Check;
                              const label = config?.label || feature.code;
                              const value = config?.format ? config.format(feature.value) : String(feature.value);

                              return (
                                <div
                                  key={feature._id}
                                  className="flex items-center gap-2.5 p-2.5 border border-zinc-100 rounded-lg bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
                                >
                                  <div className="size-7 bg-white border border-zinc-200 rounded-md flex items-center justify-center text-zinc-600 shadow-sm shrink-0">
                                    <Icon size={12} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-zinc-800">{label}</p>
                                    <p className="text-[10px] text-zinc-400">{value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <div className="pt-1">
                        <button className="w-full h-9 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-black transition-all shadow-sm">
                          Manage Plan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
