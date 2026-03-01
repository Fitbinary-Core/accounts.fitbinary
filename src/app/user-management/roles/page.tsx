"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Shield, Plus, Lock } from "lucide-react";

export default function RolesPermissionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Roles & Permissions
            </h1>
            <p className="text-zinc-500">
              Define access levels and granular permissions for your team.
            </p>
          </div>
          <button className="h-12 px-6 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Plus className="size-4" />
            Create Custom Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Super Admin", count: 2, color: "bg-brand-red" },
            { name: "Manager", count: 5, color: "bg-blue-600" },
            { name: "Viewer", count: 12, color: "bg-zinc-600" },
          ].map((role) => (
            <div
              key={role.name}
              className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`size-10 ${role.color} rounded-xl flex items-center justify-center text-white`}
                >
                  <Shield className="size-5" />
                </div>
                <div className="px-3 py-1 bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase rounded-full">
                  {role.count} Users
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {role.name}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 font-medium">
                Full system access with capability to manage billing and
                security.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <button className="text-xs font-bold text-zinc-900 uppercase tracking-wider hover:text-brand-red transition-colors">
                  Edit Role
                </button>
                <Lock className="size-3 text-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
