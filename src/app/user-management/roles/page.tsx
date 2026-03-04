"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import {
  Shield,
  Plus,
  Lock,
  Loader2,
  CheckCircle2,
  Search,
  Settings2,
  AlertCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_all_apps } from "@/services/apps/apps.service";
import {
  get_user_roles_list,
  type Role,
  type Permission,
} from "@/services/roles/roles.services";
import { IApplication } from "@/types/apps";
import { cn } from "@/lib/utils";

export default function RolesPermissionsPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: appsData, isLoading: isLoadingApps } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["user-roles", selectedApp],
    queryFn: () => get_user_roles_list(selectedApp!),
    enabled: !!selectedApp,
  });

  const roles = rolesData?.data || [];
  const applications = appsData?.applications || [];

  // Set default app if none selected
  useEffect(() => {
    if (!selectedApp && applications.length > 0) {
      setSelectedApp(applications[0]._id);
    }
  }, [applications, selectedApp]);

  const filteredRoles = roles.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.role_key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-200">
                Access Control
              </span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Roles & Permissions
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Select an application to manage its access levels and granular
              permissions.
            </p>
          </div>
        </div>

        {/* Tab Selection Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-px">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {applications.map((app: IApplication) => (
                <button
                  key={app._id}
                  onClick={() => setSelectedApp(app._id)}
                  className={cn(
                    "px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
                    selectedApp === app._id
                      ? "text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-600",
                  )}
                >
                  {app.name}
                  {selectedApp === app._id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 animate-in fade-in slide-in-from-bottom-1 duration-300" />
                  )}
                </button>
              ))}
              {isLoadingApps && (
                <div className="px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-zinc-300" />
                </div>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-sm text-xs outline-none focus:border-zinc-900 transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        {!selectedApp ? (
          <div className="py-24 border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50 flex flex-col items-center justify-center text-center px-4">
            <div className="size-16 rounded-sm bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
              <Settings2 className="size-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No App Context</h3>
            <p className="text-xs text-zinc-500 max-w-xs mt-1 font-medium">
              Choose an application above to manage its specific user roles and
              permission sets.
            </p>
          </div>
        ) : isLoadingRoles ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="size-8 animate-spin text-zinc-900" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
              Hydrating Roles Data...
            </p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="py-24 border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50 flex flex-col items-center justify-center text-center px-4">
            <AlertCircle className="size-10 text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-zinc-900">
              No Roles Matching "{searchQuery}"
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs mt-1 font-medium">
              Try adjusting your search query or filter context.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRoles.map((role: Role) => (
              <div
                key={role._id}
                className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col shadow-none"
              >
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-sm bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                      <Shield className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        {role.role_name}
                        {role.is_active && (
                          <span
                            className="size-1.5 bg-emerald-500 rounded-full"
                            title="Active"
                          />
                        )}
                      </h3>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                        KEY: {role.role_key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                        Permissions
                      </span>
                      <span className="text-sm font-black text-zinc-900">
                        {role.permissions.length}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-zinc-100 hidden md:block" />
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm: Permission) => (
                      <div
                        key={perm._id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 rounded-sm text-[10px] text-zinc-600 font-medium group hover:border-zinc-300 hover:bg-zinc-100 transition-all"
                      >
                        <CheckCircle2 className="size-3 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                        <span>{perm.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50/10 flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">
                    Last Sync: {new Date(role.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Lock className="size-2.5 text-zinc-300" />
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">
                      System Managed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
