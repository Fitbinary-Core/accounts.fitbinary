"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { get_all_apps } from "@/services/apps/apps.service";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, ExternalLink, Settings2, Puzzle } from "lucide-react";

export default function AppsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const applications = data?.applications || [];

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="size-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-200 overflow-hidden">
                    {app.icon && app.icon.startsWith("http") ? (
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="size-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(app.name) +
                            "&background=random";
                        }}
                      />
                    ) : (
                      <LayoutDashboard className="size-6" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                    >
                      {app.isActive ? "Active" : "Inactive"}
                    </span>
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors">
                      <Settings2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-8 flex-1">
                  <h3 className="font-bold text-zinc-900 mb-2 group-hover:text-brand-red transition-colors capitalize">
                    {app.name}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {app.description}
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
                      +0
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (app.baseRoute) {
                        window.open(
                          app.baseRoute,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                    className="text-[10px] font-bold cursor-pointer text-zinc-400 uppercase tracking-widest flex items-center gap-1 hover:text-brand-red transition-colors"
                  >
                    Access <ExternalLink className="size-3" />
                  </button>
                </div>
              </div>
            ))
          )}

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
