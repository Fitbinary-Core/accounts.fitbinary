"use client";

import { useState, useRef, useEffect } from "react";
import { Grid, LayoutDashboard, ExternalLink, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get_all_apps } from "@/services/apps/apps.service";
import { cn } from "@/lib/utils";

const getBrandStyle = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("fitstock")) {
    return "bg-brand-red text-white border-brand-red";
  }
  if (lowerName.includes("fitcloud")) {
    return "bg-blue-600 text-white border-blue-600";
  }
  return "bg-zinc-900 text-white border-zinc-900";
};

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const applications = data?.applications || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-xl cursor-pointer transition-all duration-300",
          isOpen
            ? "bg-zinc-100 text-brand-red scale-95"
            : "hover:bg-zinc-100 text-zinc-600 hover:scale-105",
        )}
        title="App Launcher"
      >
        <Grid className="w-5 h-5 transition-transform group-hover:rotate-12" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white border border-zinc-100 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 overflow-hidden">
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-zinc-950 rounded-lg flex items-center justify-center">
                  <Sparkles className="size-4 text-brand-red fill-brand-red" />
                </div>
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  Fitbinary Apps
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const brandStyle = getBrandStyle(app.name);
                  return (
                    <button
                      key={app._id}
                      onClick={() => {
                        if (app.baseRoute) {
                          window.open(
                            app.baseRoute,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div
                        className={cn(
                          "size-12 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-active:scale-95 border-2 shadow-sm",
                          brandStyle,
                        )}
                      >
                        <img
                          src="/Icon.png"
                          alt={app.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-zinc-800 tracking-tight group-hover:text-brand-red transition-colors capitalize px-1 truncate w-full">
                        {app.name}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-3 py-12 text-center bg-zinc-50 rounded-3xl">
                  <LayoutDashboard className="size-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-xs font-medium text-zinc-500">
                    No apps available yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-zinc-50/80 backdrop-blur-sm border-t border-zinc-100 flex justify-center">
            <button
              onClick={() => {
                window.location.href = "/apps";
                setIsOpen(false);
              }}
              className="px-6 py-2.5 bg-white border border-zinc-200 rounded-full text-[11px] font-black text-zinc-900 hover:text-brand-red hover:border-brand-red/20 hover:shadow-lg transition-all flex items-center gap-2 uppercase tracking-widest group"
            >
              Manage Apps{" "}
              <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
