"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { Rocket, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-red/20">
              Setup Guide
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
              <Sparkles className="size-3" />
              Progress: 0%
            </div>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
            Welcome to <span className="text-brand-red">Fitbinary</span>{" "}
            Onboarding
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl">
            Let's get your organization set up for success. Follow these steps
            to configure your workspace, invite your team, and start utilizing
            our ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-zinc-900 rounded-3xl text-white border border-zinc-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-full bg-brand-red/5 -skew-x-12 translate-x-16 group-hover:bg-brand-red/10 transition-colors" />
            <div className="relative z-10">
              <div className="size-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
                <Rocket className="size-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Step 1: Organization Profile
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Complete your organization's identity and basic branding
                settings.
              </p>
              <button className="h-10 px-6 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition-all">
                Configure Now
              </button>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-all">
            <div className="relative z-10">
              <div className="size-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100">
                <Rocket className="size-6 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-900">
                Step 2: Team Integration
              </h3>
              <p className="text-zinc-500 text-sm mb-6">
                Invite your first administrators and set up initial role
                structures.
              </p>
              <button className="h-10 px-6 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all">
                Invite Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
