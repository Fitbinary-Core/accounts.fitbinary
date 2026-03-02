"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Save, MoveLeft, MapPin } from "lucide-react";
import Link from "next/link";

export default function BranchCreatePage() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <Link
            href="/branches"
            className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-all"
          >
            <MoveLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Create Branch
            </h1>
            <p className="text-zinc-500">Add a new operational location.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Branch Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kathmandu Regional Hub"
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="e.g. Bagmati, Nepal"
                  className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Contact Information
              </label>
              <textarea
                placeholder="Manager details, phone numbers, and operational hours..."
                className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-50">
            <Link
              href="/branches"
              className="h-12 px-6 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
            >
              Cancel
            </Link>
            <button className="h-12 px-8 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
              <Save className="size-4" />
              Initialize Branch
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
