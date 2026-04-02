"use client";

import { useQuery } from "@tanstack/react-query";
import { userProfile } from "@/services/auth/auth.service";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { AccountCard } from "@/components/dashboard/AccountCard";
import {
  ShieldCheck,
  User,
  Database,
  Settings,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
    staleTime: 1000 * 60 * 60 * 4,
  });

  const user = data?.user;

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Welcome Section */}
        <div className="relative group">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-red/20">
                  Accounts Portal
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                  <Sparkles className="size-3" />
                  System Active
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] mb-4">
                Welcome back,
                <br />
                <span className="text-zinc-400">
                  {user?.first_name || "User"}
                </span>
              </h1>
              <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
                Centralized management for your organization, users, and
                security settings across the entire Fitbinary ecosystem.
              </p>
            </div>

            <div className="flex-col items-end hidden md:flex">
              <div className="text-right mb-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Authenticated as
                </p>
                <p className="text-sm font-semibold text-zinc-900">
                  {user?.email}
                </p>
              </div>
              <div className="size-12 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-6 text-zinc-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() =>
              window.open("/quick-setup", "_blank", "noopener,noreferrer")
            }
            className="bg-zinc-900 rounded-2xl p-6 text-white group cursor-pointer hover:bg-zinc-800 transition-all border border-zinc-800"
          >
            <div className="size-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors">
              <Zap className="size-5" />
            </div>
            <h3 className="font-bold mb-1">Quick Setup</h3>
            <p className="text-zinc-500 text-xs mb-4">
              Configure your workspace defaults in seconds.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-brand-red uppercase tracking-wider">
              Start Guide <ArrowRight className="size-3" />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 group cursor-pointer hover:border-zinc-300 transition-all">
            <div className="size-10 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-zinc-100 transition-colors">
              <ShieldCheck className="size-5 text-zinc-600" />
            </div>
            <h3 className="font-bold mb-1">Security Score</h3>
            <p className="text-zinc-500 text-xs mb-4">
              Your account is 85% secure. Complete 2 steps.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 uppercase tracking-wider group-hover:text-brand-red transition-colors">
              View Actions <ArrowRight className="size-3" />
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 group cursor-pointer hover:border-zinc-300 transition-all">
            <div className="size-10 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-zinc-100 transition-colors">
              <Settings className="size-5 text-zinc-600" />
            </div>
            <h3 className="font-bold mb-1">System Status</h3>
            <p className="text-zinc-500 text-xs mb-4">
              All Fitbinary services are operational.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 uppercase tracking-wider group-hover:text-brand-red transition-colors">
              Network Map <ArrowRight className="size-3" />
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountCard
            title="Privacy & Data Control"
            description="Manage your data lifecycle, export your information, and control how your activity is processed."
            icon={Database}
            linkText="Configure Privacy"
            path="/privacy"
          />
          <AccountCard
            title="Security & Access"
            description="Update your credentials, monitor active sessions, and configure multi-factor authentication."
            icon={ShieldCheck}
            linkText="Manage Security"
            path="/security"
          />
          <AccountCard
            title="Organization & Users"
            description="Manage your team members, define granular roles, and oversee organizational policies."
            icon={User}
            linkText="Team Settings"
            path="/user-management/users"
          />
          <AccountCard
            title="Billing & Infrastructure"
            description="Monitor credit usage, manage payment methods, and oversee global subscription plans."
            icon={Settings}
            linkText="Financial Hub"
            path="/payments"
          />
        </div>

        {/* Footer Banner */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-full bg-zinc-50 -skew-x-12 translate-x-32 group-hover:bg-brand-red/5 transition-colors duration-500" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                Need a custom enterprise solution?
              </h3>
              <p className="text-zinc-500 text-sm">
                Fitbinary offers tailored infrastructure and support for
                large-scale organizations. Contact our solutions team for a
                dedicated rollout.
              </p>
            </div>
            <button className="h-12 px-8 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
