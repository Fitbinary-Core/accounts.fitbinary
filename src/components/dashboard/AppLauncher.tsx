"use client";

import { useState, useRef, useEffect } from "react";
import { Grid, LayoutDashboard, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get_all_apps } from "@/services/apps/apps.service";

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
        className={`p-2 rounded-lg transition-colors ${
          isOpen
            ? "bg-zinc-100 text-brand-red"
            : "hover:bg-zinc-100 text-zinc-600"
        }`}
        title="App Launcher"
      >
        <Grid className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              My Applications
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {applications.length > 0 ? (
              applications.map((app) => (
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
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 transition-all group"
                >
                  <div className="size-12 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-200 group-hover:border-brand-red/30 group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
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
                      <LayoutDashboard className="size-6 text-zinc-400 group-hover:text-brand-red transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center truncate w-full capitalize">
                    {app.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center">
                <p className="text-xs text-zinc-500">No applications found</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
            <button
              onClick={() => {
                window.location.href = "/apps";
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-zinc-500 hover:text-brand-red uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              All Apps <ExternalLink className="size-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
