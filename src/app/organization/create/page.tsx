"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Save, MoveLeft } from "lucide-react";
import Link from "next/link";

export default function OrganizationCreatePage() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <Link
            href="/organization/list"
            className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-all"
          >
            <MoveLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Create Organization
            </h1>
            <p className="text-zinc-500">Register a new corporate entity.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g. Fitbinary Services Ltd"
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Type
              </label>
              <select className="w-full h-12 px-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20">
                <option>Main Company</option>
                <option>Regional Branch</option>
                <option>Subsidiary</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                placeholder="Brief description of the organization..."
                className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-50">
            <Link
              href="/organization/list"
              className="h-12 px-6 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
            >
              Cancel
            </Link>
            <button className="h-12 px-8 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2">
              <Save className="size-4" />
              Save Organization
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
