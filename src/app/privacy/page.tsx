"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import {
  ShieldCheck,
  Database,
  Lock,
  UserCheck,
  Archive,
  Dumbbell,
  Activity,
  Globe,
  FileText,
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="w-full p-8 mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Privacy & Legal
            </div>
            <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <Globe className="size-3" />
              Standardized Compliance
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-none">
            Privacy & Data <br />
            <span className="text-zinc-400">Governance</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Global Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="size-6 text-brand-red" />
              Executive Summary
            </h2>
            <p className="text-zinc-500 leading-relaxed italic">
              "At Fitbinary, we don't just secure your business; we protect your
              legacy. Our commitment to data sovereignty ensures that business
              owners remain the sole administrators of their operational
              intelligence."
            </p>
            <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
              <p>
                Fitbinary.com operates as a centralized infrastructure provider
                for modern enterprise solutions. Whether you are utilizing{" "}
                <strong>Fitstock</strong> for inventory or{" "}
                <strong>Fitcloud</strong> for facility management, your data is
                isolated, encrypted, and remains under your exclusive control.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              At a Glance
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Lock, text: "End-to-end Encryption" },
                { icon: Database, text: "Isolated Tenant Storage" },
                { icon: UserCheck, text: "Owner-controlled Access" },
                { icon: Activity, text: "Real-time Audit Logs" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700"
                >
                  <item.icon className="size-3 text-zinc-400" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Specific Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
          {/* Fitstock */}
          <div className="space-y-6 group">
            <div className="size-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-brand-red transition-colors duration-500 shadow-xl shadow-zinc-200">
              <Archive className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              Fitstock: Inventory Intelligence
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              For supply chain and retail operations, we collect and process SKU
              data, transaction history, and vendor information. This data is
              used solely to provide analytics, predict stockouts, and manage
              your logistics ecosystem within the Access Panel.
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">
                Key Data Handled
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {[
                  "Inventory Levels",
                  "Sale Records",
                  "Supplier Data",
                  "Cost Tracking",
                ].map((t, i) => (
                  <li
                    key={i}
                    className="text-[10px] text-zinc-600 font-medium flex items-center gap-1"
                  >
                    <div className="size-1 bg-zinc-300 rounded-full" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fitcloud */}
          <div className="space-y-6 group">
            <div className="size-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-brand-red transition-colors duration-500 shadow-xl shadow-zinc-200">
              <Dumbbell className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              Fitcloud: Facility Ecosystem
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Managing health and fitness centers requires handling sensitive
              member information. Fitcloud processes attendance records,
              membership subscriptions, and trainer assignments. We implement
              additional layers of privacy for member PII (Personally
              Identifiable Information).
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">
                Key Data Handled
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {[
                  "Member Profiles",
                  "Check-in Logs",
                  "Subscription Plans",
                  "Trainer KPIs",
                ].map((t, i) => (
                  <li
                    key={i}
                    className="text-[10px] text-zinc-600 font-medium flex items-center gap-1"
                  >
                    <div className="size-1 bg-zinc-300 rounded-full" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Access Panel Context */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-zinc-800 -skew-x-12 translate-x-32" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Lock className="size-8 text-brand-red" />
              <h2 className="text-2xl font-bold">The Access Panel Guarantee</h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              This Access Panel is your central command for privacy. You have
              the right to request a full data export for any of your subscribed
              applications (Fitstock/Fitcloud) at any time. We do not sell your
              business intelligence to third parties; your data is your capital.
            </p>
            {/* <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-6 py-2 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-100 transition-all">
                                Download Data
                            </button>
                            <button className="px-6 py-2 bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700">
                                Security Audit
                            </button>
                        </div> */}
          </div>
        </div>

        {/* Contact/Support Section */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-zinc-400">
            <FileText className="size-5" />
            <p className="text-xs font-medium">
              Need more detailed compliance documents?
            </p>
          </div>
          <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest cursor-pointer hover:text-brand-red transition-colors">
            Contact Privacy Office <span className="ml-1">→</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
