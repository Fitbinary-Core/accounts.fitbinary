"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { CreditCard, Receipt, ArrowUpRight, DollarSign } from "lucide-react";

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Payments & Subscriptions
          </h1>
          <p className="text-zinc-500">
            Manage your payment methods, billing history, and active
            subscriptions.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-full bg-zinc-50 -skew-x-12 translate-x-32 group-hover:bg-brand-red/5 transition-colors duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="size-14 bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-zinc-200">
                  <DollarSign className="size-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-zinc-900">
                      Enterprise Plan
                    </h3>
                    <span className="px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm max-w-md">
                    Your next billing date is{" "}
                    <span className="text-zinc-900 font-semibold">
                      April 12, 2024
                    </span>{" "}
                    for{" "}
                    <span className="text-zinc-900 font-semibold">$499.00</span>
                    .
                  </p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="h-11 px-6 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all">
                  Manage Sub
                </button>
                <button className="h-11 px-6 bg-white border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all">
                  View Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 mb-1">
                    Payment Methods
                  </h2>
                  <p className="text-sm text-zinc-500">
                    How you pay for Fitbinary services.
                  </p>
                </div>
                <CreditCard className="size-5 text-zinc-400" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center font-bold text-[10px] text-zinc-400 uppercase">
                      Visa
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        •••• 4242
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        Expires 12/26
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest cursor-pointer hover:underline">
                    Default
                  </span>
                </div>
                <button className="w-full py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest border border-dashed border-zinc-300 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 transition-all flex items-center justify-center gap-2">
                  Add Payment Method
                </button>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 mb-1">
                    Recent Transactions
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Your latest billing activity.
                  </p>
                </div>
                <Receipt className="size-5 text-zinc-400" />
              </div>
              <div className="divide-y divide-zinc-100">
                {[
                  {
                    date: "Mar 12, 2024",
                    amount: "$499.00",
                    desc: "Enterprise Plan - Mar",
                  },
                  {
                    date: "Feb 12, 2024",
                    amount: "$499.00",
                    desc: "Enterprise Plan - Feb",
                  },
                  {
                    date: "Jan 12, 2024",
                    amount: "$499.00",
                    desc: "Enterprise Plan - Jan",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        {item.desc}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-zinc-900">
                        {item.amount}
                      </span>
                      <ArrowUpRight className="size-4 text-zinc-300 group-hover:text-brand-red transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 mt-auto border-t border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-brand-red cursor-pointer transition-colors">
                  View All History
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
