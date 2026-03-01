"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import {
  LayoutDashboard,
  ExternalLink,
  Settings2,
  Plus,
  Puzzle,
  Globe,
  Zap,
} from "lucide-react";

export default function AppsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
              App Management
            </h1>
            <p className="text-zinc-500">
              Oversee and configure applications connected to your Fitbinary
              ecosystem.
            </p>
          </div>
          <button className="h-11 px-6 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2">
            <Plus className="size-4" /> Register New App
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Fitstock Core",
              desc: "Inventory and warehouse management system.",
              status: "Active",
              icon: LayoutDashboard,
              color: "bg-blue-500",
            },
            {
              name: "Fitbinary Analytics",
              desc: "Real-time data visualization and reporting.",
              status: "Processing",
              icon: Zap,
              color: "bg-amber-500",
            },
            {
              name: "Global Edge CDN",
              desc: "Distributed content delivery and optimization.",
              status: "Active",
              icon: Globe,
              color: "bg-emerald-500",
            },
          ].map((app, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`size-12 ${app.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-200`}
                >
                  <app.icon className="size-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                  >
                    {app.status}
                  </span>
                  <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Settings2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="font-bold text-zinc-900 mb-2 group-hover:text-brand-red transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {app.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((u) => (
                    <div
                      key={u}
                      className="size-6 rounded-full border-2 border-white bg-zinc-200"
                    />
                  ))}
                  <div className="size-6 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                    +5
                  </div>
                </div>
                <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 hover:text-brand-red transition-colors">
                  Dashboard <ExternalLink className="size-3" />
                </button>
              </div>
            </div>
          ))}

          <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-zinc-100 hover:border-zinc-400 transition-all min-h-60">
            <div className="size-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-zinc-400 group-hover:text-brand-red transition-all">
              <Puzzle className="size-8" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">Explore Plugins</h3>
            <p className="text-xs text-zinc-500 max-w-40">
              Extend functionality with marketplace additions.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
