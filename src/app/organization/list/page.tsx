"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Building2, Plus, Search, Edit2 } from "lucide-react";
import Link from "next/link";

const organizations = [
  { id: "1", name: "Fitbinary Global", type: "Main", status: "Active" },
  { id: "2", name: "Fitbinary Asia", type: "Regional", status: "Active" },
];

export default function OrganizationListPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Organizations
            </h1>
            <p className="text-zinc-500">
              Manage your corporate entities and organizational structure.
            </p>
          </div>
          <Link
            href="/organization/create"
            className="h-12 px-6 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2"
          >
            <Plus className="size-4" />
            New Organization
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                className="w-full h-11 pl-11 pr-4 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-50">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Type
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
                {organizations.map((org) => (
                  <tr
                    key={org.id}
                    className="group hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                          <Building2 className="size-5 text-zinc-400" />
                        </div>
                        <span className="font-bold text-zinc-900">
                          {org.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {org.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md border border-emerald-100">
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/organization/${org.id}/edit`}
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
