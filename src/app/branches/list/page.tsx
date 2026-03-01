"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { GitBranch, Plus, Search, Edit2, MapPin } from "lucide-react";
import Link from "next/link";

const branches = [
  {
    id: "1",
    name: "Kathmandu HQ",
    location: "Bagmati, Nepal",
    status: "Active",
  },
  { id: "2", name: "Lalitpur Hub", location: "Patan, Nepal", status: "Active" },
];

export default function BranchesListPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Branches
            </h1>
            <p className="text-zinc-500">
              Manage your physical and logic units across different locations.
            </p>
          </div>
          <Link
            href="/branches/create"
            className="h-12 px-6 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2"
          >
            <Plus className="size-4" />
            New Branch
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search branches..."
                className="w-full h-11 pl-11 pr-4 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-50">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Branch Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {branches.map((branch) => (
                  <tr
                    key={branch.id}
                    className="group hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center">
                          <GitBranch className="size-5" />
                        </div>
                        <span className="font-bold text-zinc-900">
                          {branch.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <MapPin className="size-3.5" />
                        {branch.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md border border-emerald-100">
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/branches/${branch.id}/edit`}
                        className="p-2 text-zinc-400 hover:text-brand-red transition-colors inline-block"
                      >
                        <Edit2 className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
