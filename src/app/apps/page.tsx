"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { get_all_apps } from "@/services/apps/apps.service";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Settings2, Puzzle } from "lucide-react";

const getBrandStyle = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("fitstock")) {
    return {
      bg: "bg-brand-red",
      text: "text-brand-red",
      border: "border-brand-red/10",
      lightBg: "bg-brand-red/5",
    };
  }
  if (lowerName.includes("fitcloud")) {
    return {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-600/10",
      lightBg: "bg-blue-600/5",
    };
  }
  return {
    bg: "bg-zinc-900",
    text: "text-zinc-900",
    border: "border-zinc-200",
    lightBg: "bg-zinc-50",
  };
};

export default function AppsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
    staleTime: 1000 * 60 * 60 * 4,
  });

  const applications = data?.applications || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-3">
              App Management
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl font-medium leading-tight">
              Manage and access your Fitbinary integrated applications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-4">
              <div className="size-12 border-4 border-zinc-100 border-t-brand-red rounded-full animate-spin"></div>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                Syncing Applications...
              </p>
            </div>
          ) : (
            applications.map((app) => {
              const brand = getBrandStyle(app.name);
              return (
                <div
                  key={app._id}
                  className="group relative bg-white border border-zinc-100 rounded-md p-8 transition-all duration-300 hover:shadow-xl hover:border-zinc-200 flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div
                      className={`size-12 rounded-full flex items-center justify-center text-white shadow-sm ${brand.bg} border-2 border-white/10 overflow-hidden transition-all duration-300 group-hover:scale-110`}
                    >
                      {app.icon && app.icon.startsWith("http") ? (
                        <img
                          src="/Icon.png"
                          alt={app.name}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-white font-black text-3xl uppercase">
                          {app.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${app.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                      >
                        {app.isActive ? "Active" : "Inactive"}
                      </span>
                      <button className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-200 shadow-sm">
                        <Settings2 className="size-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-10 flex-1 relative z-10">
                    <h3 className="text-2xl font-black text-zinc-900 mb-3 group-hover:text-brand-red transition-colors capitalize tracking-tight">
                      {app.name}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium line-clamp-3">
                      {app.description ||
                        "Manage your workflows efficiently with our premium integrated solution for Fitbinary."}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-zinc-50 flex items-center justify-between relative z-10 mt-auto">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((u) => (
                        <div
                          key={u}
                          className="size-8 rounded-2xl border-2 border-white bg-zinc-100 overflow-hidden shadow-sm"
                        >
                          <img
                            src="/Icon.png"
                            className="size-full object-cover grayscale opacity-50 text-[10px] flex items-center justify-center"
                            alt="User"
                          />
                        </div>
                      ))}
                      <div className="size-8 rounded-2xl border-2 border-white bg-zinc-950 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                        +12
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
                      className="px-6 py-3 bg-zinc-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-red hover:shadow-[0_10px_20px_rgba(239,68,68,0.3)] transition-all active:scale-95 group/btn"
                    >
                      Open App{" "}
                      <ExternalLink className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div
            className="group relative bg-zinc-50/50 border-2 border-dashed border-zinc-200 rounded-md p-8 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/20 cursor-pointer min-h-95"
            onClick={() => window.open("https://fitbinary.com", "_blank")}
          >
            <div className="size-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-zinc-200/50 text-zinc-300 group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-zinc-100">
              <Puzzle className="size-10" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-2 group-hover:tracking-wider transition-all duration-500">
              Explore Marketplace
            </h3>
            <p className="text-sm text-zinc-500 max-w-50 font-medium leading-relaxed">
              Discover and install more powerful apps from the Fitbinary Central
              Market.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
