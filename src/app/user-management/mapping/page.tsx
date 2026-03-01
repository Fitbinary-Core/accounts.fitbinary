"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Key, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function RolesMappingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
            Assigned Roles
          </h1>
          <p className="text-zinc-500">
            Map specific roles to users and manage their global access tokens.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-100">
          <div className="size-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 relative">
            <Key className="size-10 text-zinc-400" />
            <div className="absolute -bottom-1 -right-1 size-8 bg-brand-red rounded-full flex items-center justify-center text-white border-4 border-zinc-50">
              <LinkIcon className="size-3" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">
            Roles Mapping Interface
          </h3>
          <p className="text-zinc-500 text-sm max-w-sm mb-8">
            This module allows you to bulk assign roles to filtered user groups
            across multiple applications in your workspace.
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/5 text-zinc-600 rounded-xl text-xs font-medium border border-zinc-200">
            <AlertCircle className="size-4" />
            Development phase: UI components arriving soon.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
