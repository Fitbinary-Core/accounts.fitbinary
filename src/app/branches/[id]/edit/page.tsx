"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Save, MoveLeft, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BranchEditPage() {
  const params = useParams();
  const id = params.id;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/branches/list"
              className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-all"
            >
              <MoveLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                Edit Branch
              </h1>
              <p className="text-zinc-500">Updating Branch ID: {id}</p>
            </div>
          </div>
          <button className="h-10 px-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2">
            <Trash2 className="size-3.5" />
            Terminate Branch
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Branch Name
              </label>
              <input
                type="text"
                defaultValue="Kathmandu HQ"
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
                  defaultValue="Bagmati, Nepal"
                  className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-red/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-50">
            <Link
              href="/branches/list"
              className="h-12 px-6 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
            >
              Cancel
            </Link>
            <button className="h-12 px-8 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
              <Save className="size-4" />
              Update Branch
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
