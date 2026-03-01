"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { User, Mail, Phone, Calendar } from "lucide-react";

export default function PersonalPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Personal Information
          </h1>
          <p className="text-zinc-500">
            Manage the basic information used across the Fitbinary dashboard.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">
                Basic Profile
              </h2>
              <p className="text-sm text-zinc-500">
                Some info may be visible to other people using Fitbinary
                services.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {[
                {
                  label: "Photo",
                  value: "A photo helps personalize your account",
                  icon: User,
                },
                { label: "Name", value: "Nabaraj Basnet", icon: User },
                { label: "Birthday", value: "January 1, 1990", icon: Calendar },
                { label: "Gender", value: "Male", icon: User },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-24">
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
                Contact Information
              </h2>
              <p className="text-sm text-zinc-500">
                Manage your primary and recovery contact methods.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {[
                { label: "Email", value: "nabaraj@fitbinary.com", icon: Mail },
                { label: "Phone", value: "+1 (555) 000-0000", icon: Phone },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-24">
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
