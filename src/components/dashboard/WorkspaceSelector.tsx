"use client";

import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, ExternalLink, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workspace {
  _id: string;
  app: string;
  org_id: {
    _id: string;
    business_name: string;
    business_type: string;
    business_logo: string;
  };
  branch_id: {
    _id: string;
    branch_name: string;
    branch_location: string;
    branch_type: string;
  };
  role_id: {
    _id: string;
    role_name: string;
    role_key: string;
    specific_key: string | null;
  };
  status: string;
}

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
}

const APP_CONFIG: Record<string, { label: string; url: string; color: string; dotColor: string }> = {
  fitcloud: {
    label: "FitCloud",
    url: "https://fitcloud.fitbinary.com/",
    color: "bg-blue-600 text-white",
    dotColor: "bg-blue-500",
  },
  fitstock: {
    label: "FitStock",
    url: "https://fitstock.fitbinary.com/",
    color: "bg-brand-red text-white",
    dotColor: "bg-brand-red",
  },
};

const LOCAL_STORAGE_KEYS: Record<string, string> = {
  fitcloud: "fitcloud_workspace_key",
};

export function WorkspaceSelector({ workspaces }: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const grouped = workspaces.reduce<Record<string, Workspace[]>>((acc, ws) => {
    const app = ws.app.toLowerCase();
    if (!acc[app]) acc[app] = [];
    acc[app].push(ws);
    return acc;
  }, {});

  const handleSelect = (workspace: Workspace) => {
    const app = workspace.app.toLowerCase();
    const storageKey = LOCAL_STORAGE_KEYS[app];

    if (storageKey) {
      localStorage.setItem(storageKey, workspace.role_id.specific_key ?? workspace.role_id.role_key);
    }

    const appConfig = APP_CONFIG[app];
    if (appConfig) {
      window.open(appConfig.url, "_blank", "noopener,noreferrer");
    }

    setIsOpen(false);
  };

  if (workspaces.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          isOpen
            ? "bg-zinc-100 text-brand-red scale-95"
            : "hover:bg-zinc-100 text-zinc-700 hover:scale-105"
        )}
        title="Switch Workspace"
      >
        <Layers className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">Workspaces</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-100 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 overflow-hidden">
          <div className="p-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="size-7 bg-zinc-950 rounded-lg flex items-center justify-center">
                <Building2 className="size-3.5 text-white" />
              </div>
              <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                Select Workspace
              </h3>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {Object.entries(grouped).map(([app, items]) => {
              const appConfig = APP_CONFIG[app];
              return (
                <div key={app}>
                  <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", appConfig?.color ?? "bg-zinc-800 text-white")}>
                      {appConfig?.label ?? app}
                    </span>
                  </div>
                  {items.map((ws) => (
                    <button
                      key={ws._id}
                      onClick={() => handleSelect(ws)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group border-b border-zinc-50 last:border-0"
                    >
                      <div className="size-9 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200 bg-zinc-100">
                        {ws.org_id.business_logo ? (
                          <img
                            src={ws.org_id.business_logo}
                            alt={ws.org_id.business_name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center">
                            <Building2 className="size-4 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-brand-red transition-colors">
                          {ws.org_id.business_name}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{ws.branch_id.branch_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={cn("inline-block size-1.5 rounded-full flex-shrink-0", appConfig?.dotColor ?? "bg-zinc-400")} />
                          <span className="text-[10px] text-zinc-400 font-medium">{ws.role_id.role_name}</span>
                          <span className="text-[10px] text-zinc-300">·</span>
                          <span className="text-[10px] text-zinc-400">{ws.branch_id.branch_type}</span>
                        </div>
                      </div>
                      <ExternalLink className="size-3.5 text-zinc-300 group-hover:text-brand-red transition-colors flex-shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
