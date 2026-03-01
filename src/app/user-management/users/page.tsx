"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Users, UserPlus, Search } from "lucide-react";

export default function UsersListPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Users List
            </h1>
            <p className="text-zinc-500">
              Manage all users across your organization's workspace.
            </p>
          </div>
          <button className="h-12 px-6 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2">
            <UserPlus className="size-4" />
            Add New User
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search users by name, email or role..."
                className="w-full h-11 pl-11 pr-4 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
            </div>
            <select className="h-11 px-4 bg-zinc-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-red/20">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Standard</option>
            </select>
          </div>
          <div className="p-12 text-center">
            <div className="size-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100">
              <Users className="size-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              No users found
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Start by adding your first team member to the organization.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
