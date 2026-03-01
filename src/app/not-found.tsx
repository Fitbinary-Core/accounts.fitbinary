"use client";

import Link from "next/link";
import {
  MoveLeft,
  Home,
  HelpCircle,
  Search,
  AlertTriangle,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <div className="relative inline-block">
          <div className="text-[180px] md:text-[240px] font-black text-white/5 leading-none tracking-tighter select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-24 md:size-32 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 group hover:rotate-0 transition-transform duration-500">
              <AlertTriangle className="size-10 md:size-14 text-brand-red animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Lost in the <span className="text-brand-red">Fitbinary</span> Orbit?
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            The page you are looking for seems to have moved to a different
            coordinate or never existed in this dimension.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-14 px-8 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center justify-center gap-3 group"
          >
            <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto h-14 px-8 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-3 group"
          >
            <Home className="size-4 group-hover:scale-110 transition-transform" />
            Return Home
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link
            href="/personal-info"
            className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl flex items-center gap-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="size-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-brand-red transition-colors">
              <Search className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Find your account</p>
              <p className="text-xs text-zinc-500">
                Access your security settings
              </p>
            </div>
          </Link>
          <button className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl flex items-center gap-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group">
            <div className="size-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-brand-red transition-colors">
              <HelpCircle className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Help Center</p>
              <p className="text-xs text-zinc-500">Contact our support team</p>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-12 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="size-6 bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
            <img src="/Icon.png" alt="" className="size-full object-cover" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Fitbinary Accounts
          </span>
        </div>
      </div>
    </div>
  );
}
