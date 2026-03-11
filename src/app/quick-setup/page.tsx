"use client";

import {
  CheckCircle2,
  Circle,
  Rocket,
  Building2,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Briefcase,
  Users2,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function QuickSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Organization Identity",
      description: "Define your business core and brand presence.",
      icon: Building2,
      tasks: [
        "Upload Professional Logo",
        "Set Legal Business Name",
        "Configure Primary Contact",
        "Define Fiscal Year Defaults",
      ],
    },
    {
      id: 2,
      title: "Activate Ecosystem",
      description: "Enable the specialized tools your business needs.",
      icon: LayoutGrid,
      tasks: [
        "Provision Fitstock (Inventory)",
        "Configure Fitcloud (Gym Ops)",
        "Sync Cross-app Metadata",
        "Set Global Currency & Units",
      ],
    },
    {
      id: 3,
      title: "Team & Security",
      description: "Secure your workspace and invite your crew.",
      icon: ShieldCheck,
      tasks: [
        "Enable Multi-Factor Auth",
        "Define Role-based Access",
        "Invite Department Heads",
        "Audit Initial Security Score",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-brand-red/10 selection:text-brand-red">
      {/* SEO & Metadata */}
      <head>
        <title>Quick Setup Guide | Fitbinary Command Center</title>
        <meta
          name="description"
          content="Streamlined onboarding for Fitbinary's enterprise ecosystem. Configure Fitstock, Fitcloud, and your organizational identity in minutes."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      {/* Standalone Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Portal
          </Link>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex items-center gap-2">
            <Rocket className="size-5 text-brand-red" />
            <span className="font-black tracking-tighter text-xl">
              FITBINARY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <span className={cn(currentStep >= 1 ? "text-zinc-900" : "")}>
              Identity
            </span>
            <ArrowRight className="size-3" />
            <span className={cn(currentStep >= 2 ? "text-zinc-900" : "")}>
              Ecosystem
            </span>
            <ArrowRight className="size-3" />
            <span className={cn(currentStep >= 3 ? "text-zinc-900" : "")}>
              Security
            </span>
          </div>
          <button className="px-5 py-2.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
            Get Help
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-red/20">
              Onboarding Experience
            </div>
            <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <Sparkles className="size-3" />
              Instance Ready
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[0.9]">
            Initialize your <br />
            <span className="text-zinc-400 font-extralight italic">
              Enterprise.
            </span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
            Welcome to the Fitbinary Setup Guide. We've streamlined the complex
            task of organizational configuration into three distinct milestones.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "group flex items-start gap-4 p-6 rounded-3xl border transition-all duration-500 cursor-pointer",
                    currentStep === step.id
                      ? "bg-zinc-900 border-zinc-900 shadow-2xl shadow-zinc-200 text-white translate-x-4"
                      : "bg-white border-zinc-100 hover:border-zinc-300 text-zinc-400",
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500",
                      currentStep === step.id
                        ? "bg-brand-red"
                        : "bg-zinc-50 group-hover:bg-zinc-100",
                    )}
                  >
                    <step.icon
                      className={cn(
                        "size-5",
                        currentStep === step.id
                          ? "text-white"
                          : "text-zinc-400",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3
                      className={cn(
                        "font-bold text-sm",
                        currentStep === step.id
                          ? "text-white"
                          : "text-zinc-900",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[10px] leading-relaxed text-gray-500">
                      {step.description}
                    </p>
                  </div>
                  {currentStep > step.id && (
                    <CheckCircle2 className="size-4 text-brand-red ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-zinc-50 rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Setup Status
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">
                    {Math.round((currentStep / 3) * 100)}%
                  </span>
                  <span className="text-xs font-bold text-zinc-500 uppercase">
                    Deployed
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-red transition-all duration-1000 ease-in-out"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Zap className="size-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">
                  Fast-track mode active
                </p>
              </div>
            </div>
          </div>

          {/* Active Work Area */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-white border border-zinc-100 rounded-[40px] p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

              <div className="relative z-10 space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em]">
                      Module 0{currentStep}
                    </p>
                    <h2 className="text-3xl font-black text-zinc-900">
                      {steps[currentStep - 1].title}
                    </h2>
                  </div>
                  {(() => {
                    const Icon = steps[currentStep - 1].icon;
                    return <Icon className="size-12 text-zinc-100" />;
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {steps[currentStep - 1].tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="group/item flex items-center justify-between p-6 rounded-3xl bg-zinc-50/50 border border-zinc-50 hover:bg-white hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full border-2 border-zinc-200 group-hover/item:border-brand-red transition-colors flex items-center justify-center">
                          <div className="size-2 bg-brand-red rounded-full scale-0 group-hover/item:scale-100 transition-transform" />
                        </div>
                        <span className="text-sm font-bold text-zinc-600 group-hover/item:text-zinc-900 transition-colors">
                          {task}
                        </span>
                      </div>
                      <ChevronLeft className="size-4 text-zinc-300 rotate-180 group-hover/item:text-brand-red transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-zinc-50">
                  <button
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 disabled:opacity-0 transition-all"
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep < 3) setCurrentStep((prev) => prev + 1);
                    }}
                    className="group h-16 px-10 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 flex items-center gap-4"
                  >
                    {currentStep === 3
                      ? "Initialize Workspace"
                      : "Validate Milestone"}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Global Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Briefcase, label: "Organization", value: "Verified" },
                { icon: Users2, label: "Admin Access", value: "Primary Only" },
                { icon: ShieldCheck, label: "Compliance", value: "Standard" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-zinc-50 rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <stat.icon className="size-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase">
                      {stat.label}
                    </p>
                    <p className="text-xs font-bold text-zinc-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="py-20 text-center space-y-4">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
          Built for scale with Fitbinary
        </p>
        <div className="flex items-center justify-center gap-4 opacity-20">
          <div className="h-px w-20 bg-zinc-400" />
          <Rocket className="size-5" />
          <div className="h-px w-20 bg-zinc-400" />
        </div>
      </footer>
    </main>
  );
}
