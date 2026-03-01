"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { ShieldCheck, Lock, Smartphone, Key, Clock } from "lucide-react";

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Security Settings
          </h1>
          <p className="text-zinc-500">
            Settings and recommendations to help you keep your account secure.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-full bg-brand-red opacity-10 -skew-x-12 translate-x-32 group-hover:opacity-20 transition-all duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-brand-red rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-red/20">
                  <ShieldCheck className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Security Checkup</h3>
                  <p className="text-zinc-400 text-sm max-w-md">
                    We found 2 recommended actions to further secure your
                    account and data.
                  </p>
                </div>
              </div>
              <button className="h-11 px-6 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition-all shrink-0">
                Review Now
              </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">
                Signing in to Fitbinary
              </h2>
              <p className="text-sm text-zinc-500">
                Control how you access your account and verify your identity.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {[
                {
                  label: "Password",
                  value: "Last changed 3 months ago",
                  icon: Lock,
                },
                {
                  label: "2-Step Verification",
                  value: "On since Oct 12, 2023",
                  icon: Smartphone,
                },
                { label: "Passkeys", value: "2 devices registered", icon: Key },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-32">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-zinc-900">
                      {item.value}
                    </span>
                  </div>
                  <item.icon className="size-4 text-zinc-300 group-hover:text-brand-red transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">
                Recent Security Activity
              </h2>
              <p className="text-sm text-zinc-500">
                Review security events from the last 28 days.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {[
                {
                  label: "New Sign-in",
                  value: "Linux - Berlin, Germany",
                  icon: Clock,
                },
                {
                  label: "Password Change",
                  value: "Successful password reset",
                  icon: Lock,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-32">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-zinc-900">
                      {item.value}
                    </span>
                  </div>
                  <item.icon className="size-4 text-zinc-300 group-hover:text-brand-red transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
