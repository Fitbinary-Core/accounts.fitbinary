"use client";

import { useQuery } from "@tanstack/react-query";
import { get_onboarding_data } from "@/services/onboarding/onboarding.service";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Building2,
  MapPin,
  Tag,
  CreditCard,
  Rocket,
} from "lucide-react";
import BusinessDetails from "./steps/BusinessDetails";
import LocationAndMetadata from "./steps/LocationAndMetadata";
import BranchSetup from "./steps/BranchSetup";
import Categories from "./steps/Categories";
import PlansAndPricing from "./steps/PlansAndPricing";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/Layout";

const Onboarding = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-data"],
    queryFn: get_onboarding_data,
  });

  const steps = useMemo(() => {
    if (!data) return [];
    return [
      {
        id: "BUSINESS_DETAILS",
        label: "Business Profile",
        icon: Building2,
        isCompleted: data.business_details.is_completed,
        component: <BusinessDetails business_details={data} />,
      },
      {
        id: "LOCATION_METADATA",
        label: "Localization",
        icon: MapPin,
        isCompleted: data.location_and_metadata_details.is_completed,
        component: <LocationAndMetadata location_and_metadata={data} />,
      },
      {
        id: "BRANCH_SETUP",
        label: "Initial Branch",
        icon: Rocket,
        isCompleted: data.branch_details.is_completed,
        component: <BranchSetup branch_details={data.branch_details} />,
      },
      {
        id: "CATEGORIES",
        label: "Industry Focus",
        icon: Tag,
        isCompleted: data.categories_details.is_completed,
        component: <Categories />,
      },
      {
        id: "PLANS",
        label: "Select Plan",
        icon: CreditCard,
        isCompleted: data.subscription_details.is_completed,
        component: <PlansAndPricing />,
      },
    ];
  }, [data]);

  const activeStepIndex = useMemo(() => {
    if (!steps.length) return 0;
    const firstIncomplete = steps.findIndex((s) => !s.isCompleted);
    return firstIncomplete === -1 ? steps.length - 1 : firstIncomplete;
  }, [steps]);

  const [localActiveIndex, setLocalActiveIndex] = useState<number | null>(null);
  const currentIndex =
    localActiveIndex !== null ? localActiveIndex : activeStepIndex;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-600" />
          <p className="animate-pulse font-bold text-gray-500 uppercase tracking-widest text-xs">
            Initializing Launch Sequence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-full selection:bg-red-100 selection:text-red-900">
        {/* Background Decor */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-red-50/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vh] bg-gray-100/50 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1 text-xs font-black text-red-600 uppercase tracking-tighter">
                  <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  Live Onboarding
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                  Ready to <span className="text-red-600">Scale?</span>
                </h1>
                <p className="max-w-md text-base text-gray-500 leading-relaxed font-medium">
                  Complete your business architecture to access the full power
                  of the Fitbinary Ecosystem.
                </p>
              </div>

              <nav className="relative space-y-2">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200/60" />

                {steps.map((step, idx) => {
                  const isActive = idx === currentIndex;
                  const isCompleted = step.isCompleted;
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setLocalActiveIndex(idx)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300",
                        isActive
                          ? "bg-white shadow-xl shadow-gray-200/50 border border-gray-100 ring-1 ring-black/5"
                          : "hover:bg-gray-100/50",
                      )}
                    >
                      <div
                        className={cn(
                          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-500",
                          isCompleted
                            ? "border-green-500 bg-green-50 text-green-600"
                            : isActive
                              ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-200"
                              : "border-gray-200 bg-white text-gray-400 group-hover:border-red-200",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs font-bold uppercase tracking-widest transition-colors",
                              isActive ? "text-red-600" : "text-gray-400",
                            )}
                          >
                            Phase 0{idx + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-black text-green-600 uppercase">
                              Verified
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "truncate text-lg font-bold transition-colors",
                            isActive ? "text-gray-900" : "text-gray-500",
                          )}
                        >
                          {step.label}
                        </p>
                      </div>

                      <ChevronRight
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive
                            ? "translate-x-0 opacity-100 text-red-600"
                            : "-translate-x-2 opacity-0 text-gray-300",
                        )}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Assistance Badge */}
              <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Support Terminal
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-300 mb-6 leading-relaxed">
                  Need expert configuration assistance? Our architecture
                  specialists are standing by.
                </p>
                <button className="w-full rounded-md bg-white py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100 active:scale-95 shadow-lg shadow-white/5">
                  Contact Ops
                </button>
              </div>
            </div>

            {/* Configuration Canvas */}
            <main className="lg:col-span-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-200/50 md:p-12 lg:min-h-150">
                {/* Step Header */}
                <div className="mb-12 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
                    {(() => {
                      const StepIcon = steps[currentIndex]?.icon;
                      return StepIcon ? <StepIcon className="h-8 w-8" /> : null;
                    })()}
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-900">
                    {steps[currentIndex]?.label}
                  </h2>
                  <div className="mt-4 h-1 w-12 bg-red-600 rounded-full" />
                </div>

                {/* Component Render */}
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  {steps[currentIndex]?.component}
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-50/20 rounded-tl-[100px] pointer-events-none" />
              </div>

              {/* Security Footer */}
              <div className="mt-8 flex items-center justify-between px-4">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1.5 border-r border-gray-200 pr-4">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    AES-256 Encrypted
                  </span>
                  <span>PCI-DSS Compliant</span>
                </div>
                <p className="text-[10px] font-bold text-gray-300 uppercase">
                  © Fitbinary Core Architecture v2.0
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Onboarding;
